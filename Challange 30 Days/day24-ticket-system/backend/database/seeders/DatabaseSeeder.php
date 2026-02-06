<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. استدعاء سيدر الأقسام (ضروري جداً للتذاكر)
        // تأكد أنك أنشأت ملف CategorySeeder مسبقاً
        $this->call(CategorySeeder::class);

        // 2. إنشاء الأدوار الأساسية
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $agentRole = Role::firstOrCreate(['name' => 'Agent']);
        $customerRole = Role::firstOrCreate(['name' => 'Customer']);

        // 3. حساب الأدمن (Admin) 👮‍♂️
        $admin = User::create([
            'name' => 'مدير النظام',
            'email' => 'admin@nexus.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $admin->assignRole($adminRole);

        // 4. حساب العميل (Customer/User) 👤
        $customer = User::create([
            'name' => 'عميل محترم',
            'email' => 'client@nexus.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $customer->assignRole($customerRole);

        // 5. حساب موظف (Agent) - نحتاجه لاحقاً للرد
        $agent = User::create([
            'name' => 'موظف الدعم',
            'email' => 'agent@nexus.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $agent->assignRole($agentRole);
    }
}

