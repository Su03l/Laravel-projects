<?php

namespace App\Actions;

use App\Models\User;

class ToggleTwoFactorAction
{
    public function execute(User $user, bool $enable): void
    {
        $user->update(['two_factor_enabled' => $enable]);

        // If disabled, clear any old OTP code for cleanliness
        if (!$enable) {
            $user->update(['otp_code' => null, 'otp_expires_at' => null]);
        }
    }
}
