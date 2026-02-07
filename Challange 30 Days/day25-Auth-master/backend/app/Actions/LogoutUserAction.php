<?php

namespace App\Actions;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class LogoutUserAction
{
    public function execute(User $user): void
    {
        // حذف التوكن الحالي فقط (Current Device)
        $user->currentAccessToken()->delete();

        // لو تبغى تحذفه من كل الأجهزة:
        $user->tokens()->delete();
    }
}
