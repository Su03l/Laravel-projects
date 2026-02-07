<?php

namespace App\Actions;

use App\DTOs\LoginUserDTO;
use App\Models\User;
use App\Interfaces\OtpServiceInterface;
use App\Enums\UserStatus;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginUserAction
{
    public function __construct(
        protected OtpServiceInterface $otpService // 👈 نحتاج الخدمة لإرسال الكود
    ) {}

    public function execute(LoginUserDTO $data): array
    {
        // 1. البحث عن المستخدم
        $user = User::where('email', $data->email)->first();

        // 2. التحقق من الباسورد + وجود المستخدم
        if (!$user || !Hash::check($data->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['بيانات الدخول غير صحيحة.'],
            ]);
        }

        // 3. التحقق من انتهاء مدة الحظر المؤقت
        if ($user->status === UserStatus::BANNED && $user->banned_until && now()->gt($user->banned_until)) {
            // انتهت العقوبة 🎉.. نرجعه active ونصفر التاريخ
            $user->update([
                'status' => UserStatus::ACTIVE,
                'banned_until' => null
            ]);
        }

        // 4. التحقق من الحالة (Business Logic) 🚦
        // إذا كان محظوراً أو معلقاً، نمنعه
        if ($user->status !== UserStatus::ACTIVE) {
            $message = 'حسابك غير مفعل أو محظور. يرجى التحقق من الرمز أو الاتصال بالدعم.';

            if ($user->status === UserStatus::BANNED && $user->banned_until) {
                $message = 'حسابك محظور مؤقتاً حتى: ' . $user->banned_until->format('Y-m-d H:i');
            }

            throw ValidationException::withMessages([
                'email' => [$message],
            ]);
        }

        // 🔀 السيناريو الأول: المستخدم مفعل الـ OTP
        if ($user->two_factor_enabled) {
            // نرسل الكود
            $this->otpService->generateAndSend($user);

            return [
                'status' => '2fa_required', // إشارة للفرونت إند يفتح صفحة الكود
                'message' => 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
                'email' => $data->email // عشان الفرونت يعرف لمين يرسل الكود
            ];
        }

        // ⏩ السيناريو الثاني: دخول مباشر (بدون OTP)

        // حساب مدة التوكن (يومين لو اختار تذكرني، ساعتين لو لا) ⏳
        $expiration = $data->remember_me ? now()->addDays(2) : now()->addHours(2);

        // إنشاء التوكن مع تاريخ انتهاء
        $token = $user->createToken('auth_token', ['*'], $expiration)->plainTextToken;

        return [
            'status' => 'success',
            'user' => $user,
            'token' => $token
        ];
    }
}
