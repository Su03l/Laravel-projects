<?php

namespace App\Actions;

use App\Models\User;
use App\Services\OtpService;
use Illuminate\Validation\ValidationException;

class VerifyLoginOtpAction
{
    public function __construct(protected OtpService $otpService) {}

    public function execute(string $email, string $otp): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !$this->otpService->verify($user, $otp)) {
            throw ValidationException::withMessages(['otp' => ['الرمز غير صحيح.']]);
        }

        $token = $user->createToken('auth_token', [$user->role->value])->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
            'role' => $user->role->value,
        ];
    }
}
