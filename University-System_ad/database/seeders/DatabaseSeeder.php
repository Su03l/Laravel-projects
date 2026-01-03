<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::factory()->create([
            'name' => 'Academic Advisor',
            'email' => 'admin@uni.edu',
            'university_id' => 'ADMIN01',
            'role' => 'advisor', // هذا هو المهم
            'password' => bcrypt('password'), // كلمة المرور: password
        ]);

        // 2. إنشاء 10 طلاب
        \App\Models\User::factory(10)->create([
            'role' => 'student'
        ]);

        \App\Models\Course::factory(10)
            ->has(\App\Models\Section::factory()->count(3))
            ->create();
    }
}
