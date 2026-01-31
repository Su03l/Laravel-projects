<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // إنشاء مدير النظام
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@sull.com',
            'password' => Hash::make('123123123'),
            'role' => 'admin'
        ]);

        // إنشاء موظف تجريبي
        $employee = User::create([
            'name' => 'Ahmed Employee',
            'email' => 'ahmed@sull.com',
            'password' => Hash::make('123123123'),
            'role' => 'employee'
        ]);

        // إنشاء 100 معاملة مالية مرتبطة بالمدير والموظف بشكل عشوائي
        Transaction::factory()->count(100)->create([
            'user_id' => fn() => collect([$admin->id, $employee->id])->random()
        ]);
    }
}
