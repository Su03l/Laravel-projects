<?php

namespace App\Actions;

use App\Models\User;
use App\Services\OtpService;
use Illuminate\Validation\ValidationException;

class SendResetCodeAction
{
    public function __construct(protected OtpService $otpService) {}

    public function execute(string $email): void
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            throw ValidationException::withMessages(['email' => ['البريد الإلكتروني غير مسجل.']]);
        }

        $this->otpService->generateAndSend($user, 'reset_password');
    }
}
