<?php

namespace App\Http\Controllers\Auth;

use App\Actions\LoginUserAction;
use App\Actions\LoginVerifyOtpAction;
use App\Actions\LogoutUserAction;
use App\DTOs\LoginUserDTO;
use App\Http\Controllers\Controller;
use App\Http\Resources\User\UserResource;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function login(Request $request, LoginUserAction $action)
    {
        // 1. Validation
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember_me' => 'boolean' // 👈 استقبال الحقل
        ]);

        // 2. DTO
        $dto = LoginUserDTO::fromRequest($request);

        // 3. Action
        $result = $action->execute($dto);

        // إذا كان يطلب 2FA
        if ($result['status'] === '2fa_required') {
            return response()->json($result); // يرجع Requires 2FA
        }

        // إذا كان دخول مباشر
        return response()->json([
            'message' => 'تم تسجيل الدخول بنجاح',
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
        ]);
    }

    // تأكيد الدخول (المرحلة الثانية - لأصحاب الـ 2FA)
    public function loginVerify(Request $request, LoginVerifyOtpAction $action)
    {
        $request->validate([
            'email' => 'required|email',
            'otp_code' => 'required',
            'remember_me' => 'boolean' // عشان نحسب مدة التوكن صح
        ]);

        $result = $action->execute($request->email, $request->otp_code, $request->boolean('remember_me'));

        return response()->json([
            'message' => 'تم تأكيد الرمز وتسجيل الدخول',
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
        ]);
    }

    /**
     * تسجيل الخروج
     */
    public function logout(Request $request, LogoutUserAction $action)
    {
        // نستدعي الـ Action ونمرر له اليوزر الحالي
        $action->execute($request->user());

        return response()->json([
            'message' => 'تم تسجيل الخروج بنجاح'
        ]);
    }
}
