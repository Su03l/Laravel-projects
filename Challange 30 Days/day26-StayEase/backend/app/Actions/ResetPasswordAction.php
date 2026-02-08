<?php

namespace App\Actions;

use App\Models\User;
use App\Services\OtpService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ResetPasswordAction
{
    public function __construct(protected OtpService $otpService) {}

    public function execute(string $email, string $otp, string $newPassword): void
    {
        $user = User::where('email', $email)->first();

        if (!$user || !$this->otpService->verify($user, $otp)) {
            throw ValidationException::withMessages(['otp' => ['الرمز غير صحيح أو منتهي الصلاحية.']]);
        }

        $user->update([
            'password' => Hash::make($newPassword)
        ]);
    }
}
