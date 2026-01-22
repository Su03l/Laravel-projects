<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Tweet;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // مستخدم رئيسي
        $mainUser = User::factory()->create([
            'name' => 'خالد',
            'username' => 'khaled_dev',
            'email' => 'khaled@example.com',
            'password' => bcrypt('password123'),
        ]);

        // 49 مستخدم إضافي
        $users = User::factory(49)->create();

        $allUsers = $users->concat([$mainUser]);

        // كل مستخدم عنده 50 تويت
        foreach ($allUsers as $user) {
            Tweet::factory(50)->create([
                'user_id' => $user->id
            ]);
        }

        // نظام فولو واقعي
        foreach ($allUsers as $user) {
            $toFollow = $allUsers
                ->where('id', '!=', $user->id)
                ->random(rand(10, 25))
                ->pluck('id')
                ->toArray();

            $user->followings()->syncWithoutDetaching($toFollow);
        }

        $this->command->info(' تم إنشاء 50 مستخدم وكل واحد عنده 50 تويت!');
        $this->command->info('👤 حساب تجريبي: khaled@example.com | password123');
    }
}
