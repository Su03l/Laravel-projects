<?php

namespace App\Http\Controllers;

use App\Actions\Auth\LoginUserAction;
use App\Actions\Auth\RegisterUserAction;
use App\Actions\ResetPasswordAction;
use App\Actions\SendResetCodeAction;
use App\Actions\VerifyLoginOtpAction;
use App\Actions\VerifyUserAction;
use App\DTOs\LoginUserDTO;
use App\DTOs\RegisterUserDTO;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(RegisterRequest $request, RegisterUserAction $action): JsonResponse
    {
        $dto = RegisterUserDTO::fromRequest($request);

        $result = $action->execute($dto);

        return response()->json($result, 201);
    }

    public function verifyAccount(Request $request, VerifyUserAction $action): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required'
        ]);

        $result = $action->execute($request->email, $request->otp);

        return response()->json([
            'message' => 'تم تفعيل الحساب بنجاح',
            'data' => $result
        ]);
    }

    public function login(Request $request, LoginUserAction $action): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $dto = LoginUserDTO::fromRequest($request);
        $result = $action->execute($dto);

        if ($result['status'] === '2fa_required') {
            return response()->json($result);
        }

        return response()->json([
            'message' => 'تم تسجيل الدخول بنجاح',
            'data' => $result,
        ]);
    }

    public function loginVerify(Request $request, VerifyLoginOtpAction $action): JsonResponse
    {
        $request->validate(['email' => 'required|email', 'otp' => 'required']);
        $result = $action->execute($request->email, $request->otp);
        return response()->json(['message' => 'تم الدخول بنجاح', 'data' => $result]);
    }

    public function forgotPassword(Request $request, SendResetCodeAction $action): JsonResponse
    {
        $request->validate(['email' => 'required|email']);
        $action->execute($request->email);
        return response()->json(['message' => 'تم إرسال رمز الاستعادة.']);
    }

    public function resetPassword(Request $request, ResetPasswordAction $action): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required',
            'password' => 'required|min:8|confirmed'
        ]);
        $action->execute($request->email, $request->otp, $request->password);
        return response()->json(['message' => 'تم تغيير كلمة المرور بنجاح.']);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'تم تسجيل الخروج بنجاح']);
    }
}
