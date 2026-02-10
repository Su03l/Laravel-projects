<?php

namespace App\Services;

use App\Models\User;
use App\Mail\OtpMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Carbon\Carbon;

class OtpService
{
    /**
     * Generate and send OTP to user.
     */
    public function sendOtp(User $user, string $reason = 'Verification')
    {
        // 1. Rate Limiting
        $key = 'send-otp:' . $user->id;

        if (RateLimiter::tooManyAttempts($key, 3)) {
            abort(429, 'Too many OTP requests. Please wait a minute.');
        }

        RateLimiter::hit($key, 60);

        $otp = (string) rand(100000, 999999);

        $user->update([
            'otp_code' => $otp,
            'otp_expires_at' => Carbon::now()->addMinutes(10),
        ]);

        // تحديد العنوان والتصميم بناءً على السبب 🎨
        [$subject, $view] = match($reason) {
            'Verification' => ['Verify Your Account', 'emails.verify-account'],
            'Login 2FA' => ['Two-Factor Authentication Code', 'emails.login-2fa'],
            'Password Reset' => ['Password Reset Request', 'emails.reset-password'],
            default => ['Security Code', 'emails.verify-account'] // Fallback to verify template
        };

        Mail::to($user->email)->send(new OtpMail($otp, $subject, $view));
    }

    /**
     * Verify the OTP code.
     */
    public function verifyOtp(User $user, string $code): bool
    {
        // 2. Rate Limiting
        $key = 'verify-otp:' . $user->id;

        if (RateLimiter::tooManyAttempts($key, 5)) {
            abort(429, 'Too many failed attempts. Please try again later.');
        }

        if ($user->otp_code === $code && $user->otp_expires_at > Carbon::now()) {
            RateLimiter::clear($key);

            $user->update([
                'otp_code' => null,
                'otp_expires_at' => null,
                'email_verified_at' => $user->email_verified_at ?? Carbon::now(),
            ]);
            return true;
        }

        RateLimiter::hit($key, 300);
        return false;
    }
}
