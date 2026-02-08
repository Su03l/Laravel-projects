<?php

namespace App\Actions;

use App\Models\User;
use App\Services\OtpService;
use App\Enums\UserStatus;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeMail;

class VerifyUserAction
{
    public function __construct(protected OtpService $otpService) {}

    public function execute(string $email, string $otp): array
    {
        $user = User::where('email', $email)->first();

        // Verify Code
        if (!$user || !$this->otpService->verify($user, $otp)) {
            throw ValidationException::withMessages(['otp' => ['رمز التفعيل غير صحيح.']]);
        }

        // Activate User
        $user->update([
            'status' => UserStatus::ACTIVE,
            'email_verified_at' => now(),
        ]);

        // Send Welcome Email
        Mail::to($user->email)->send(new WelcomeMail($user->name));

        // Create Token
        $token = $user->createToken('auth_token', [$user->role->value])->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }
}
