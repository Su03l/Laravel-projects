<?php

namespace App\Actions;

use App\Models\User;
use App\Enums\UserStatus;

class AdminBanUserAction
{
    // days: عدد الأيام (لو null يعني مؤبد)
    public function execute(User $user, ?int $days = null): void
    {
        $data = [
            'status' => UserStatus::BANNED,
            'banned_until' => $days ? now()->addDays($days) : null, // لو فيه أيام نحسب التاريخ
        ];

        $user->update($data);

        // طرده من النظام فوراً (Revoke Tokens)
        $user->tokens()->delete();
    }
}
