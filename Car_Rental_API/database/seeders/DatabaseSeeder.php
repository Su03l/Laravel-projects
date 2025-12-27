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
        // 1. إنشاء 10 سيارات متاحة
        \App\Models\Car::factory(10)->create();

        // 2. إنشاء 5 عملاء
        \App\Models\Customer::factory(5)->create();
    }
}
