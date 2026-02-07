<?php

namespace App\Http\Controllers\Admin;

use App\Actions\AdminBanUserAction;
use App\Actions\AdminRemoveAvatarAction;
use App\Actions\RegisterNewUserAction;
use App\DTOs\RegisterUserDTO;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AdminUserResource;
use App\Models\User;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    // عرض كل المستخدمين بتفاصيلهم
    public function index()
    {
        // نجيب الكل ما عداي أنا (الأدمن الحالي)
        $users = User::where('id', '!=', auth()->id())->latest()->get();

        //  نستخدم Resource الأدمن
        return AdminUserResource::collection($users);
    }

    // الأدمن يضيف مستخدم جديد (موظف أو يوزر)
    public function storeUser(Request $request, RegisterNewUserAction $action)
    {
        // الأدمن يقدر يختار الرول (Role)
        $request->validate([
            'name' => 'required',
            'email' => 'required|unique:users',
            'password' => 'required',
            'phone' => 'required', // صار مطلوب عشان الداتابيس
            'role' => 'required|in:admin,user,employee' //  ميزة للأدمن فقط
        ]);

        $dto = RegisterUserDTO::fromRequest($request);
        $user = $action->execute($dto);

        return response()->json([
            'message' => 'تم إضافة المستخدم بواسطة الأدمن',
            'user' => new AdminUserResource($user)
        ]);
    }

    public function banUser(Request $request, User $user, AdminBanUserAction $action)
    {
        $request->validate([
            'type' => 'required|in:permanent,temporary',
            'days' => 'required_if:type,temporary|integer|min:1', // مطلوب فقط لو الحظر مؤقت
        ]);

        $days = $request->type === 'temporary' ? $request->days : null;
        $action->execute($user, $days);

        return response()->json([
            'message' => 'تم حظر المستخدم بنجاح',
            'user' => new AdminUserResource($user)
        ]);
    }

    // حذف صورة مسيئة
    public function removeAvatar(User $user, AdminRemoveAvatarAction $action)
    {
        $action->execute($user);
        return response()->json([
            'message' => 'تم حذف صورة المستخدم المخالفة',
            'user' => new AdminUserResource($user)
        ]);
    }

    // تغيير صلاحية المستخدم (Role)
    public function changeRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:admin,user,employee'
        ]);

        // نمنع الأدمن من تغيير رول نفسه بالغلط
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'لا يمكنك تغيير صلاحياتك بنفسك.'], 403);
        }

        $user->update(['role' => $request->role]);

        return response()->json([
            'message' => 'تم تحديث صلاحية المستخدم بنجاح',
            'user' => new AdminUserResource($user)
        ]);
    }

    // حذف المستخدم نهائياً
    public function destroy(User $user)
    {
        // نمنع الأدمن من حذف نفسه
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'لا يمكنك حذف حسابك بنفسك.'], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'تم حذف المستخدم نهائياً'
        ]);
    }
}
