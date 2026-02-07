<?php
namespace App\Actions;

use App\Models\User;
use App\Interfaces\OtpServiceInterface;
use Illuminate\Validation\ValidationException;

class SendResetCodeAction {
    public function __construct(protected OtpServiceInterface $otpService) {}

    public function execute(string $email): void {
        $user = User::where('email', $email)->first();

        // أمني: لا تخبره أن الإيميل غير موجود، فقط أعطه رسالة عامة أو تجاهل
        if (!$user) {
             throw ValidationException::withMessages(['email' => ['لا يوجد حساب بهذا البريد.']]);
        }

        // إرسال الكود (نفس خدمة التسجيل)
        $this->otpService->generateAndSend($user);
    }
}
