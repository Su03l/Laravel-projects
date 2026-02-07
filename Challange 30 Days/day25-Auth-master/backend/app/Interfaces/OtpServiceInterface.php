<?php

namespace App\Interfaces;

use App\Models\User;

interface OtpServiceInterface
{
    public function generateAndSend(User $user): void;
}
