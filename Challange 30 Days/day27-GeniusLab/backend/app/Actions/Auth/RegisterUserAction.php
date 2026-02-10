<?php

namespace App\Actions\Auth;

use App\DTOs\RegisterUserDTO;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Support\Facades\Hash;

// Action to register a new user
class RegisterUserAction
{
    public function __construct(protected OtpService $otpService) {}

    public function execute(RegisterUserDTO $dto): User
    {
        $user = User::create([
            'name' => $dto->name,
            'email' => $dto->email,
            'password' => Hash::make($dto->password),
            'wallet_balance' => 1000,
        ]);

        // إرسال OTP
        $this->otpService->sendOtp($user, 'Verification');

        return $user;
    }
}
