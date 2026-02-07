<?php
namespace App\Actions;

use App\DTOs\ResetPasswordDTO;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ResetPasswordAction {
    public function execute(ResetPasswordDTO $data): void {
        $user = User::where('email', $data->email)->first();

        if (!$user || $user->otp_code !== $data->otp_code) {
            throw ValidationException::withMessages([
                'otp_code' => ['الرمز غير صحيح أو منتهي الصلاحية.']
            ]);
        }

        // التحقق من الوقت (اختياري لو مضاف في السيرفس)
        if ($user->otp_expires_at && now()->gt($user->otp_expires_at)) {
             throw ValidationException::withMessages(['otp_code' => ['الرمز منتهي.']]);
        }

        // تحديث الباسورد وتصفير الكود
        $user->update([
            'password' => Hash::make($data->password),
            'otp_code' => null,
            'otp_expires_at' => null
        ]);
    }
}
