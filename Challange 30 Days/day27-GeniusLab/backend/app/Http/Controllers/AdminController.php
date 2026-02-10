<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Transaction;
use App\Models\AiModel;
use App\Traits\ApiResponse;

class AdminController extends Controller
{
    use ApiResponse;

    public function stats()
    {
        // 1. عدد المستخدمين
        $usersCount = User::count();

        // 2. إجمالي استهلاك التوكنات (النقاط)
        $totalUsage = Transaction::where('type', 'usage')->sum('credits');
        $totalUsage = abs($totalUsage); // نحوله لموجب

        // 3. الموديلات النشطة
        $models = AiModel::where('is_active', true)->get(['name', 'cost_credits', 'type']);

        return $this->success([
            'users_count' => $usersCount,
            'total_credits_burned' => $totalUsage,
            'active_models' => $models
        ]);
    }
}
