<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SectionController extends Controller
{
    public function index(Request $request)
    {
        $query = Section::with('course'); // نجيب اسم المادة مع الشعبة

        // ميزة حلوة: يقدر يرسل ?course_id=5 ويجيب شعب هذي المادة بس
        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        return response()->json([
            'message' => 'قائمة الشعب الدراسية',
            'data' => $query->get()
        ]);
    }

    public function show($id)
    {
        $section = Section::with('course')->findOrFail($id);

        return response()->json([
            'message' => 'تفاصيل الشعبة الدراسية',
            'data' => $section
        ]);
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'section_number' => 'required|string',
            'days' => 'required|in:STT,MW',
            'time_start' => 'required|date_format:H:i:s',
            'time_end' => 'required|date_format:H:i:s|after:time_start',
            'professor_name' => 'required|string',
            'capacity' => 'required|integer|min:1'
        ]);

        // التحقق اليدوي من التكرار (لأننا نبغى نفس الرقم بس لمادة ثانية عادي)
        $exists = Section::where('course_id', $request->course_id)
            ->where('section_number', $request->section_number)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'رقم الشعبة موجود مسبقاً لهذه المادة! '], 400);
        }

        $section = Section::create($fields);

        return response()->json(['message' => 'تم فتح الشعبة بنجاح ', 'data' => $section], 201);
    }

    // 4. تحديث بيانات الشعبة (تغير الدكتور، الوقت، السعة)
    public function update(Request $request, $id)
    {
        $section = Section::findOrFail($id);

        $fields = $request->validate([
            'section_number' => 'sometimes|string',
            'days' => 'sometimes|in:STT,MW',
            'time_start' => 'sometimes|date_format:H:i:s',
            'time_end' => 'sometimes|date_format:H:i:s|after:time_start',
            'professor_name' => 'sometimes|string',
            'capacity' => 'sometimes|integer|min:1'
        ]);

        if ($request->has('section_number')) {
            $exists = Section::where('course_id', $section->course_id)
                ->where('section_number', $request->section_number)
                ->where('id', '!=', $id) //  استثناء الشعبة الحالية
                ->exists();

            if ($exists) {
                return response()->json(['message' => 'رقم الشعبة مستخدم بالفعل لهذه المادة '], 400);
            }
        }

        $section->update($fields);

        return response()->json(['message' => 'تم تحديث بيانات الشعبة بنجاح ', 'data' => $section]);
    }

    // 5. حذف الشعبة
    public function destroy($id)
    {
        $section = Section::findOrFail($id);
        $section->delete();

        return response()->json([
            'message' => 'تم حذف الشعبة الدراسية'
        ]);
    }
}
