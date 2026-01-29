<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Invoice;
use App\Models\Leave;
use App\Models\Project;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponse;

    public function index()
    {
        // 1. إحصائيات الموظفين (HR Stats)
        $totalEmployees = User::where('role', UserRole::EMPLOYEE)->count();
        $pendingLeaves = Leave::where('status', 'pending')->count();

        // 2. إحصائيات المشاريع (Operations Stats)
        $activeProjects = Project::where('status', 'active')->count();
        $completedProjects = Project::where('status', 'completed')->count();

        // 3. إحصائيات المال (Financial Stats - The Most Important)
        // الإيرادات: مجموع الفواتير "المدفوعة" فقط
        $totalRevenue = Invoice::where('status', 'paid')->sum('amount');

        // المصروفات: مجموع كل المصروفات المسجلة
        $totalExpenses = Expense::sum('amount');

        // صافي الربح
        $netProfit = $totalRevenue - $totalExpenses;

        // 4. تجميع البيانات
        $data = [
            'hr_stats' => [
                'total_employees' => $totalEmployees,
                'pending_leave_requests' => $pendingLeaves
            ],
            'project_stats' => [
                'active' => $activeProjects,
                'completed' => $completedProjects,
                'total' => $activeProjects + $completedProjects
            ],
            'financial_stats' => [
                'revenue' => number_format($totalRevenue, 2),
                'expenses' => number_format($totalExpenses, 2),
                'net_profit' => number_format($netProfit, 2),
                'profit_status' => $netProfit >= 0 ? 'good' : 'bad' // مؤشر بسيط
            ]
        ];

        return $this->success($data, 'تم جلب إحصائيات لوحة القيادة');
    }
}
