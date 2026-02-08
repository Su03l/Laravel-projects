<?php

namespace App\Actions\Auth;

use App\DTOs\LoginUserDTO;
use App\Models\User;
use App\Enums\UserStatus;
use App\Services\OtpService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginUserAction
{
    public function __construct(protected OtpService $otpService) {}

    public function execute(LoginUserDTO $data): array
    {
        // 1. Find User
        $user = User::where('email', $data->email)->first();

        // 2. Verify Password
        if (!$user || !Hash::check($data->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['بيانات الدخول غير صحيحة.'],
            ]);
        }

        // 3. Check Status
        if ($user->status !== UserStatus::ACTIVE) {
            throw ValidationException::withMessages([
                'email' => ['هذا الحساب محظور، يرجى التواصل مع الإدارة.'],
            ]);
        }

        // 4. Check 2FA
        if ($user->two_factor_enabled) {
            $this->otpService->generateAndSend($user, '2fa');

            return [
                'status' => '2fa_required',
                'message' => 'تم إرسال رمز التحقق إلى بريدك.',
                'email' => $user->email
            ];
        }

        // 5. Direct Login
        $token = $user->createToken('auth_token', [$user->role->value])->plainTextToken;

        return [
            'status' => 'success',
            'user' => $user,
            'token' => $token,
            'role' => $user->role->value,
        ];
    }
}
