<?php

namespace App\Http\Controllers\Auth;

use App\Actions\ResendOtpAction;
use App\Actions\VerifyUserAction;
use App\DTOs\VerifyOtpDTO;
use App\Http\Controllers\Controller;
use App\Http\Resources\User\UserResource;
use Illuminate\Http\Request;

class VerifyOTPEmailController extends Controller
{
    public function verify(Request $request, VerifyUserAction $action)
    {
        // 1. Validation
        $request->validate([
            'email' => 'required|email',
            'otp_code' => 'required|string', // الكود نصي
        ]);

        // 2. DTO
        $dto = VerifyOtpDTO::fromRequest($request);

        // 3. Action
        $user = $action->execute($dto);

        // 4. Response
        // هنا خيار لك: هل ترجعه لصفحة تسجيل الدخول؟
        // أم تعطيه توكن ويدخل مباشرة؟ (الأفضل لراحة المستخدم: نعطيه توكن فوراً)

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'تم تفعيل الحساب بنجاح! أهلاً بك.',
            'user' => new UserResource($user),
            'token' => $token, //  هدية: توكن دخول مباشر
        ]);
    }

    public function resendOtp(Request $request, ResendOtpAction $action)
    {
        $request->validate(['email' => 'required|email']);

        $action->execute($request->email);

        return response()->json([
            'message' => 'تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني.'
        ]);
    }
}
