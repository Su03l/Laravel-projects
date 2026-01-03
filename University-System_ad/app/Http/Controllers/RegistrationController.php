<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\Waitlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RegistrationController extends Controller
{
    // 1. عرض جدولي الدراسي
    public function index(Request $request)
    {
        return response()->json($request->user()->sections()->with('course')->get());
    }

    // 2. تسجيل مادة (المنطق الكامل)
    public function store(Request $request)
    {
        $request->validate([
            'section_id' => 'required|exists:sections,id',
        ]);

        $user = $request->user();
        $sectionId = $request->section_id;

        try {
            DB::beginTransaction();

            //  قفل الشعبة (Locking)
            $sectionToRegister = Section::lockForUpdate()->with('course.prerequisites')->find($sectionId);

            //  أ. التحقق من التكرار (هل المادة مسجلة مسبقاً؟)
            $alreadyRegistered = $user->sections()
                ->where('course_id', $sectionToRegister->course_id)
                ->exists();

            if ($alreadyRegistered) {
                throw new \Exception("لا يمكن تسجيل المادة {$sectionToRegister->course->code} مرتين! ");
            }

            //  ب. التحقق من المتطلبات السابقة (Prerequisites)
            // (لا يسمح بدخول الانتظار حتى لو الشعبة فل إلا إذا كان مستوفياً للشروط)
            $prerequisites = $sectionToRegister->course->prerequisites;

            if ($prerequisites->count() > 0) {
                $passedCourseIds = $user->sections()
                    ->wherePivot('grade', '>=', 60)
                    ->get()
                    ->pluck('course_id')
                    ->toArray();

                foreach ($prerequisites as $req) {
                    if (!in_array($req->id, $passedCourseIds)) {
                        throw new \Exception("عفواً، يجب اجتياز المتطلب السابق: ({$req->code}) أولاً ");
                    }
                }
            }

            //  ج. التحقق من السعة + نظام الانتظار (Waitlist Logic)
            if ($sectionToRegister->capacity <= 0) {

                // نتأكد هل هو أصلاً في الانتظار؟
                $alreadyWaiting = Waitlist::where('user_id', $user->id)
                    ->where('section_id', $sectionId)
                    ->exists();

                if ($alreadyWaiting) {
                    throw new \Exception("أنت بالفعل في قائمة الانتظار لهذه الشعبة ");
                }

                // إضافة لقائمة الانتظار
                Waitlist::create([
                    'user_id' => $user->id,
                    'section_id' => $sectionId
                ]);

                DB::commit();
                return response()->json([
                    'message' => 'الشعبة ممتلئة. تم إضافتك لقائمة الانتظار بنجاح (رقمك محفوظ) ⏳',
                    'status' => 'waitlisted'
                ], 201); // نوقف العملية هنا ونرجع رد
            }

            //  د. التحقق من تعارض الأوقات (Time Conflict)
            // (نتحقق فقط إذا كان سيسجل فعلياً، الانتظار لا يهمه التعارض حالياً)
            $studentSections = $user->sections;

            foreach ($studentSections as $existingSection) {
                if ($existingSection->days == $sectionToRegister->days) {
                    if (
                        $sectionToRegister->time_start < $existingSection->time_end &&
                        $sectionToRegister->time_end > $existingSection->time_start
                    ) {
                        throw new \Exception("يوجد تعارض في الوقت مع مادة: {$existingSection->course->name} ");
                    }
                }
            }

            //  هـ. التسجيل النهائي (Success)
            $user->sections()->attach($sectionId, ['grade' => null]);
            $sectionToRegister->decrement('capacity');

            DB::commit();

            return response()->json([
                'message' => 'تم تسجيل المادة بنجاح في جدولك ',
                'data' => $sectionToRegister
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    // 3. حذف مادة أو الانسحاب من الانتظار (Drop) ️
    public function destroy(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            $user = $request->user();

            // حالة 1: هل الطالب يريد الانسحاب من "قائمة الانتظار"؟
            $waiting = Waitlist::where('user_id', $user->id)->where('section_id', $id)->first();
            if ($waiting) {
                $waiting->delete();
                DB::commit();
                return response()->json(['message' => 'تم إلغاء طلب الانتظار بنجاح']);
            }

            // حالة 2: الطالب مسجل فعلياً ويريد حذف المادة
            $detached = $user->sections()->detach($id);

            if ($detached == 0) {
                throw new \Exception("أنت غير مسجل في هذه الشعبة");
            }

            //  الترقية التلقائية (Auto-Promotion)
            // هل يوجد أحد في الانتظار؟ (الأقدم أولاً)
            $nextInLine = Waitlist::where('section_id', $id)->orderBy('created_at', 'asc')->first();

            if ($nextInLine) {
                // 1. تسجيل الطالب المنتظر فوراً
                // ملاحظة: السعة لا تتغير (واحد طلع وواحد دخل)
                // لكن يجب التحقق من التعارض للطالب الجديد (هنا نتجاوزها للتبسيط، أو يمكن إضافتها)
                \App\Models\User::find($nextInLine->user_id)
                    ->sections()
                    ->attach($id, ['grade' => null]);

                // 2. حذفه من الانتظار
                $nextInLine->delete();

                $msg = "تم الحذف. دخل مكانك طالب من قائمة الانتظار تلقائياً 🔄";
            } else {
                // إذا القائمة فارغة، نرجع الكرسي للمخزون
                Section::where('id', $id)->increment('capacity');
                $msg = "تم حذف المادة بنجاح ";
            }

            DB::commit();
            return response()->json([
                'message' => $msg
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
