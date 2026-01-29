<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Department;
use App\Models\Client;
use App\Models\Project;
use App\Models\Task;
use App\Models\Invoice;
use App\Models\Expense;
use App\Enums\UserRole;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. إنشاء الأقسام
        $itDept = Department::create(['name' => 'IT Department']);
        $hrDept = Department::create(['name' => 'HR Department']);
        $salesDept = Department::create(['name' => 'Sales Department']);

        // 2. إنشاء السوبر أدمن (حسابك)
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@erp.com',
            'password' => Hash::make('password'),
            'role' => UserRole::ADMIN
        ]);

        // 3. إنشاء مدير HR
        $hrManager = User::create([
            'name' => 'Maha Ahmed',
            'email' => 'maha@erp.com',
            'password' => Hash::make('password'),
            'role' => UserRole::HR
        ]);
        $hrManager->employee()->create([
            'department_id' => $hrDept->id,
            'job_title' => 'HR Manager',
            'salary' => 15000,
            'joining_date' => '2023-01-01'
        ]);

        // 4. إنشاء 3 موظفين (Developers)
        $devs = [];
        for ($i = 1; $i <= 3; $i++) {
            $user = User::create([
                'name' => "Developer $i",
                'email' => "dev$i@erp.com",
                'password' => Hash::make('password'),
                'role' => UserRole::EMPLOYEE
            ]);
            $user->employee()->create([
                'department_id' => $itDept->id,
                'job_title' => 'Software Engineer',
                'salary' => 8000 + ($i * 1000),
                'joining_date' => '2024-01-01'
            ]);
            $devs[] = $user;
        }

        // 5. إنشاء عملاء (Clients)
        $client1 = Client::create([
            'company_name' => 'Tech Solutions Co.',
            'contact_person' => 'Khalid Ali',
            'email' => 'contact@techsol.com',
            'phone' => '0500000000',
            'status' => 'active'
        ]);

        // 6. إنشاء مشروع وتكليف الموظف الأول بإدارته
        $project = Project::create([
            'client_id' => $client1->id,
            'manager_id' => $devs[0]->id, // المطور الأول هو المدير
            'name' => 'ERP System V1',
            'description' => 'Building a mini ERP system',
            'budget' => 50000,
            'status' => 'active',
            'start_date' => '2024-02-01',
            'deadline' => '2024-06-01'
        ]);

        // 7. إضافة مهام (Tasks) للمشروع
        Task::create([
            'project_id' => $project->id,
            'assigned_to' => $devs[1]->id, // المطور الثاني
            'name' => 'Setup Database',
            'status' => 'completed',
            'priority' => 'high'
        ]);
        Task::create([
            'project_id' => $project->id,
            'assigned_to' => $devs[2]->id, // المطور الثالث
            'name' => 'Build API',
            'status' => 'in_progress',
            'priority' => 'medium'
        ]);

        // 8. المالية (عشان الداشبورد يشتغل)
        // فاتورة مدفوعة (Revenue)
        Invoice::create([
            'project_id' => $project->id,
            'invoice_number' => 'INV-2024-001',
            'issue_date' => '2024-02-15',
            'due_date' => '2024-02-20',
            'amount' => 25000, // دفعة أولى
            'status' => 'paid'
        ]);

        // مصروفات (Expenses)
        Expense::create([
            'project_id' => $project->id,
            'user_id' => $devs[0]->id,
            'title' => 'Server Hosting',
            'amount' => 500,
            'expense_date' => '2024-02-10'
        ]);
    }
}
