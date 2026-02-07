<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\DTOs\ForgotPasswordDTO;
use App\DTOs\ResetPasswordDTO;
use App\Actions\SendResetCodeAction;
use App\Actions\ResetPasswordAction;

class ForgotPasswordController extends Controller
{
    public function sendCode(Request $request, SendResetCodeAction $action) {
        $request->validate(['email' => 'required|email']);

        $action->execute($request->email);

        return response()->json(['message' => 'تم إرسال رمز استعادة كلمة المرور إلى بريدك.']);
    }

    public function reset(Request $request, ResetPasswordAction $action) {
        $request->validate([
            'email' => 'required|email',
            'otp_code' => 'required',
            'password' => 'required|min:8|confirmed'
        ]);

        $dto = ResetPasswordDTO::fromRequest($request);
        $action->execute($dto);

        return response()->json(['message' => 'تم تغيير كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.']);
    }
}
