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
use App\Models\Leave;
use App\Models\Attendance;
use App\Enums\UserRole;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // تهيئة الفيكر (Faker) لتوليد بيانات عشوائية
        $faker = \Faker\Factory::create();

        // 1. الأقسام (ثابتة)
        $depts = [
            Department::create(['name' => 'IT Department']),
            Department::create(['name' => 'HR Department']),
            Department::create(['name' => 'Sales Department']),
            Department::create(['name' => 'Marketing']),
            Department::create(['name' => 'Finance']),
        ];

        // 2. السوبر أدمن (حسابك)
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@erp.com',
            'password' => Hash::make('password'),
            'role' => UserRole::ADMIN
        ]);

        // 3. إنشاء 70 موظف (Employees)
        $employeeIds = []; // لتخزين الآيديهات لاستخدامها لاحقاً

        // نبدأ بمدير الـ HR عشان الموافقات
        $hrManager = User::create([
            'name' => 'HR Manager',
            'email' => 'hr@erp.com',
            'password' => Hash::make('password'),
            'role' => UserRole::HR
        ]);
        $hrManager->employee()->create([
            'department_id' => $depts[1]->id, // HR Dept
            'job_title' => 'HR Manager',
            'salary' => 25000,
            'joining_date' => '2020-01-01'
        ]);

        echo "Generating 70 Employees...\n";
        for ($i = 1; $i <= 70; $i++) {
            $user = User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password'),
                'role' => UserRole::EMPLOYEE
            ]);

            $user->employee()->create([
                'department_id' => $depts[rand(0, 4)]->id,
                'job_title' => $faker->jobTitle,
                'salary' => $faker->numberBetween(5000, 20000),
                'joining_date' => $faker->dateTimeBetween('-2 years', 'now')
            ]);

            $employeeIds[] = $user->id;

            // تسجيل حضور لليوم (Attendance) لبعض الموظفين
            if (rand(0, 1)) {
                Attendance::create([
                    'user_id' => $user->id,
                    'date' => Carbon::today(),
                    'check_in' => '08:00:00',
                    'check_out' => '16:00:00',
                    'work_hours' => 8,
                    'status' => 'present'
                ]);
            }

            // إنشاء إجازات (Leaves) لبعض الموظفين
            if (rand(0, 10) > 7) { // 30% من الموظفين عندهم طلبات إجازة
                Leave::create([
                    'user_id' => $user->id,
                    'type' => $faker->randomElement(['annual', 'sick', 'emergency']),
                    'start_date' => Carbon::now()->addDays(rand(1, 10)),
                    'end_date' => Carbon::now()->addDays(rand(11, 20)),
                    'reason' => $faker->sentence,
                    'status' => $faker->randomElement(['pending', 'approved', 'rejected'])
                ]);
            }
        }

        // 4. إنشاء 100 عميل (Clients)
        echo "Generating 100 Clients...\n";
        $clientIds = [];
        for ($i = 1; $i <= 100; $i++) {
            $client = Client::create([
                'company_name' => $faker->company,
                'contact_person' => $faker->name,
                'email' => $faker->unique()->companyEmail,
                'phone' => $faker->phoneNumber,
                'status' => $faker->randomElement(['active', 'active', 'inactive']) // فرصة الـ active أكبر
            ]);
            $clientIds[] = $client->id;
        }

        // 5. إنشاء 150 مشروع (Projects) مع مهام ومالية
        echo "Generating 150 Projects & Finance Data...\n";
        for ($i = 1; $i <= 150; $i++) {
            $status = $faker->randomElement(['active', 'active', 'completed', 'pending']);

            $project = Project::create([
                'client_id' => $clientIds[array_rand($clientIds)],
                'manager_id' => $employeeIds[array_rand($employeeIds)],
                'name' => $faker->catchPhrase,
                'description' => $faker->text(100),
                'budget' => $faker->numberBetween(10000, 500000),
                'status' => $status,
                'start_date' => $faker->dateTimeBetween('-1 year', 'now'),
                'deadline' => $faker->dateTimeBetween('now', '+1 year')
            ]);

            // إضافة مهام (Tasks) لكل مشروع (بين 3 إلى 8 مهام)
            $tasksCount = rand(3, 8);
            for ($t = 0; $t < $tasksCount; $t++) {
                Task::create([
                    'project_id' => $project->id,
                    'assigned_to' => $employeeIds[array_rand($employeeIds)],
                    'name' => $faker->sentence(3),
                    'status' => $faker->randomElement(['pending', 'in_progress', 'completed']),
                    'priority' => $faker->randomElement(['low', 'medium', 'high']),
                    'due_date' => $faker->dateTimeBetween('now', '+1 month')
                ]);
            }

            // إضافة فواتير (Invoices)
            // بعض المشاريع لها أكثر من فاتورة
            $invoicesCount = rand(1, 3);
            for ($inv = 0; $inv < $invoicesCount; $inv++) {
                Invoice::create([
                    'project_id' => $project->id,
                    'invoice_number' => 'INV-' . $faker->unique()->numerify('#####'),
                    'issue_date' => $faker->dateTimeBetween('-6 months', 'now'),
                    'due_date' => $faker->dateTimeBetween('now', '+1 month'),
                    'amount' => $faker->numberBetween(5000, 50000),
                    'status' => $faker->randomElement(['paid', 'paid', 'unpaid', 'overdue'])
                ]);
            }

            // إضافة مصروفات (Expenses)
            $expensesCount = rand(0, 5);
            for ($exp = 0; $exp < $expensesCount; $exp++) {
                Expense::create([
                    'project_id' => $project->id,
                    'user_id' => $employeeIds[array_rand($employeeIds)],
                    'title' => $faker->word . ' cost',
                    'amount' => $faker->numberBetween(100, 5000),
                    'expense_date' => $faker->dateTimeBetween('-6 months', 'now')
                ]);
            }
        }
    }
}
