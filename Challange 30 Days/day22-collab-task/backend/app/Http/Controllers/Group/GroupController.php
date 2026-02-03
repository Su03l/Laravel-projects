<?php

namespace App\Http\Controllers\Group;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // نجيب المجموعات مع عدد الأعضاء ومعرفة دوري فيها
        $groups = $user->groups()->withCount('users')->get()->map(function ($group) {
            return [
                'id' => $group->id,
                'name' => $group->name,
                'company' => $group->company_name,
                'my_role' => $group->pivot->role, // (admin/member) جبناها من الجدول الوسيط
                'members_count' => $group->users_count
            ];
        });

        return response()->json(['groups' => $groups]);
    }

    // 2. إنشاء مجموعة جديدة (Transaction مهمة هنا)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'company_name' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        // نستخدم DB::transaction عشان نضمن إن العمليتين يصيرون مع بعض أو يفشلون مع بعض
        $group = DB::transaction(function () use ($request) {
            // أ. إنشاء القروب
            $newGroup = Group::create([
                'name' => $request->name,
                'company_name' => $request->company_name,
                'description' => $request->description,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'owner_id' => $request->user()->id, // المالك الأساسي
            ]);

            // ب. إضافة المنشئ كعضو بصلاحية "admin" في الجدول الوسيط
            $newGroup->users()->attach($request->user()->id, ['role' => 'admin']);

            return $newGroup;
        });

        return response()->json([
            'message' => 'تم إنشاء المجموعة بنجاح',
            'group' => $group
        ], 201);
    }

    // 3. إضافة عضو عن طريق الإيميل (Invite Logic)
    public function addMember(Request $request, $groupId)
    {
        $request->validate(['email' => 'required|email']);

        $group = Group::findOrFail($groupId);

        // التحقق من الصلاحية: هل أنت المالك؟
        if ($group->owner_id !== $request->user()->id) {
            return response()->json([
                'message' => 'غير مصرح لك بإضافة أعضاء'
            ], 403);
        }

        // البحث عن المستخدم بالإيميل
        $userToAdd = User::where('email', $request->email)->first();

        if (!$userToAdd) {
            // هنا ممكن مستقبلاً نرسل دعوة للإيميل لو مو مسجل
            return response()->json([
                'message' => 'المستخدم غير موجود في النظام'
            ], 404);
        }

        // التحقق: هل هو موجود مسبقاً في القروب؟
        if ($group->users()->where('user_id', $userToAdd->id)->exists()) {
            return response()->json([
                'message' => 'المستخدم موجود بالفعل في المجموعة'
            ], 409);
        }

        // الإضافة كـ عضو (Member)
        $group->users()->attach($userToAdd->id, ['role' => 'member']);

        return response()->json([
            'message' => "تم إضافة {$userToAdd->first_name} بنجاح"
        ]);
    }

    // 4. حذف عضو (Kick Member)
    public function removeMember(Request $request, $groupId, $userId)
    {
        $group = Group::findOrFail($groupId);

        // صلاحية: لازم أكون أنا المالك
        if ($group->owner_id !== $request->user()->id) {
            return response()->json([
                'message' => 'صلاحيات غير كافية'
            ], 403);
        }

        // ما ينفع احذف نفسي (المالك) من هنا، لازم حذف القروب كامل
        if ($group->owner_id == $userId) {
            return response()->json([
                'message' => 'لا يمكنك حذف مالك المجموعة'
            ], 400);
        }

        // الحذف من الجدول الوسيط
        $group->users()->detach($userId);

        return response()->json([
            'message' => 'تم استبعاد العضو من المجموعة'
        ]);
    }
}
