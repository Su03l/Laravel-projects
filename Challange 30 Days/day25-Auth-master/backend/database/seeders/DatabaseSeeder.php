<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'المدير العام',
            'email' => 'admin@admin.com',
            'phone' => '0123456789',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => \App\Enums\UserRole::ADMIN,
            'status' => \App\Enums\UserStatus::ACTIVE,
            'otp_verified_at' => now(),
        ]);
    }
}
