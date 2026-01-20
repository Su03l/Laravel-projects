<?php

namespace Database\Seeders;

use App\Models\Tweet;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // إنشاء مستخدم تجريبي ثابت
        $testUser = User::factory()->create([
            'name' => 'admin',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        Tweet::factory(10)->create([
            'user_id' => $testUser->id,
        ]);

        User::factory(10)->create()->each(function ($user) {
            Tweet::factory(rand(3, 7))->create([
                'user_id' => $user->id,
            ]);
        });
    }
}
