<?php
namespace App\Actions;

use App\Models\User;
use Illuminate\Validation\ValidationException;

class LoginVerifyOtpAction
{
    // نستقبل الإيميل، الكود، وهل يبي "تذكرني" ولا لا
    public function execute(string $email, string $otpCode, bool $rememberMe): array
    {
        $user = User::where('email', $email)->first();

        // تحقق الكود (نفس المنطق السابق)
        if (!$user || $user->otp_code !== $otpCode) {
            throw ValidationException::withMessages(['otp_code' => ['الرمز غير صحيح.']]);
        }

        if ($user->otp_expires_at && now()->gt($user->otp_expires_at)) {
            throw ValidationException::withMessages(['otp_code' => ['انتهت صلاحية الرمز.']]);
        }

        // ✅ نجاح: نصفر الكود ونعطيه التوكن
        $user->update(['otp_code' => null, 'otp_expires_at' => null]);

        // نفس منطق التوكن
        $expiration = $rememberMe ? now()->addDays(2) : now()->addHours(2);
        $token = $user->createToken('auth_token', ['*'], $expiration)->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }
}
