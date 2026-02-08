<?php

namespace App\Actions\Auth;

use App\DTOs\RegisterUserDTO;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Support\Facades\Hash;

class RegisterUserAction
{
    public function __construct(protected OtpService $otpService) {}

    public function execute(RegisterUserDTO $dto): array
    {
        // 1. Create User with PENDING status
        $user = User::create([
            'name' => $dto->name,
            'email' => $dto->email,
            'phone' => $dto->phone,
            'password' => Hash::make($dto->password),
            'role' => UserRole::CUSTOMER,
            'status' => UserStatus::PENDING,
        ]);

        // 2. Send Verification Code
        $this->otpService->generateAndSend($user, 'verification');

        // 3. Return message only (no token)
        return [
            'user' => $user,
            'message' => 'تم إنشاء الحساب. يرجى تفعيل بريدك الإلكتروني.',
            'require_verification' => true
        ];
    }
}
