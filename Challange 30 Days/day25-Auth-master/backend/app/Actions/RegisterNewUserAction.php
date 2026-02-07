<?php

namespace App\Actions;

use App\DTOs\RegisterUserDTO;
use App\Models\User;
use App\Services\LogOtpService;

// افترضنا أنك أنشأتها

class RegisterNewUserAction
{
    public function execute(RegisterUserDTO $data): User
    {
        // 1. إنشاء المستخدم
        $user = User::create($data->toArray());

        // 2. إرسال الـ OTP (فقط إذا لم يكن مفعلاً مسبقاً)
        // مثلاً الأدمن ممكن يضيف موظف ويفعله مباشرة، لكن هنا سنفترض الكل يحتاج OTP
        $otpService = new LogOtpService();
        $otpService->generateAndSend($user);

        return $user;
    }
}
