<?php

namespace App\Actions;

use App\Models\User;
use App\Interfaces\OtpServiceInterface;
use Illuminate\Validation\ValidationException;
use App\Enums\UserStatus;

class ResendOtpAction
{
    public function __construct(
        protected OtpServiceInterface $otpService
    )
    {
    }

    public function execute(string $email): void
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            throw ValidationException::withMessages(['email' => ['المستخدم غير موجود']]);
        }

        if ($user->status === UserStatus::ACTIVE) {
            throw ValidationException::withMessages(['email' => ['الحساب مفعل بالفعل']]);
        }

        // توليد وإرسال كود جديد
        $this->otpService->generateAndSend($user);
    }
}
