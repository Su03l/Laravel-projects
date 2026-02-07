<?php

namespace App\Actions;

use App\DTOs\VerifyOtpDTO;
use App\Models\User;
use App\Enums\UserStatus;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeMail;
use Illuminate\Support\Facades\Log;

class VerifyUserAction
{
    public function execute(VerifyOtpDTO $data): User
    {
        // 1. البحث عن المستخدم
        $user = User::where('email', $data->email)->first();

        // 2. التحقق من وجود المستخدم
        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['البريد الإلكتروني غير موجود.'],
            ]);
        }

        // 3. التحقق: هل الحساب مفعل أصلاً؟ (Edge Case)
        if ($user->status === UserStatus::ACTIVE) {
            return $user; // نرجعه كما هو، لا داعي للخطأ
        }

        // 4. التحقق من صحة الكود
        if ($user->otp_code !== $data->otp_code) {
            throw ValidationException::withMessages([
                'otp_code' => ['رمز التحقق غير صحيح.'],
            ]);
        }

        // 5. التحقق من صلاحية الوقت (Expiration)
        // تأكد أنك أضفت casts لـ otp_expires_at في المودل كما اتفقنا سابقاً
        if ($user->otp_expires_at && now()->gt($user->otp_expires_at)) {
            throw ValidationException::withMessages([
                'otp_code' => ['انتهت صلاحية الرمز. يرجى طلب رمز جديد.'],
            ]);
        }

        // 6. تفعيل الحساب (النجاح! )
        $user->update([
            'status' => UserStatus::ACTIVE,    // تغيير الحالة
            'otp_code' => null,                // حذف الكود للأمان
            'otp_expires_at' => null,          // تصفير الوقت
            'otp_verified_at' => now(),        // تسجيل توقيت التفعيل
        ]);

        // 7. إرسال ترحيب
        try {
            Mail::to($user->email)->send(new WelcomeMail($user));
        } catch (\Exception $e) {
            // لا توقف العملية إذا فشل الإرسال، فقط سجل خطأ
            Log::error("فشل إرسال الترحيب: " . $e->getMessage());
        }

        return $user;
    }
}
