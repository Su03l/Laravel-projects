<?php

namespace App\Services;

use App\Interfaces\OtpServiceInterface;
use App\Models\User;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Mail;
use App\Mail\OtpNotificationMail;

class LogOtpService implements OtpServiceInterface
{
    public function generateAndSend(User $user): void
    {
        // 1. توليد كود عشوائي من 6 أرقام
        $code = (string)rand(100000, 999999);

        // 2. تخزين الكود في الداتابيس مع وقت انتهاء (10 دقائق)
        $user->update([
            'otp_code' => $code,
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        // 3. الإرسال الحقيقي للإيميل
        // بدلاً من Log::info، نستخدم Mail::to
        try {
            Mail::to($user->email)->send(new OtpNotificationMail($code));
            Log::info(" Email sent to {$user->email}");
        } catch (\Exception $e) {
            Log::error(" Failed to send email: " . $e->getMessage());
        }
    }
}
