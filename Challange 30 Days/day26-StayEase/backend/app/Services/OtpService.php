<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserVerificationMail;
use App\Mail\TwoFactorLoginMail;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\Log;

class OtpService
{
    public function generateAndSend(User $user, string $type = 'verification'): void
    {
        $code = (string) rand(1000, 9999);

        $user->update([
            'otp_code' => $code,
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        // Log the OTP for debugging
        Log::info("OTP for user {$user->email} ({$type}): {$code}");

        // Send the appropriate email
        if ($type === 'verification') {
            Mail::to($user->email)->send(new UserVerificationMail($user, $code));
        }
        elseif ($type === '2fa') {
            Mail::to($user->email)->send(new TwoFactorLoginMail($user, $code));
        }
        elseif ($type === 'reset_password') {
            Mail::to($user->email)->send(new ResetPasswordMail($user, $code));
        }
    }

    public function verify(User $user, string $code): bool
    {
        if ($user->otp_code === $code && $user->otp_expires_at && now()->lt($user->otp_expires_at)) {
            // Clear OTP after successful verification
            $user->update(['otp_code' => null, 'otp_expires_at' => null]);
            return true;
        }
        return false;
    }
}
