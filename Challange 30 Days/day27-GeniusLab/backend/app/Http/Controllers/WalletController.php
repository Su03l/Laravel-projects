<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WalletController extends Controller
{
    // 1. واجهة المحفظة الكاملة (لصفحة الفواتير)
    public function index(Request $request)
    {
        $user = $request->user();

        // إحصائيات سريعة
        $stats = [
            'current_balance' => $user->wallet_balance,
            'total_usage' => $user->transactions()->where('type', 'usage')->sum('credits'), // كم صرف بالمجمل (بالسالب)
            'total_deposits' => $user->transactions()->where('type', 'deposit')->sum('credits'), // كم شحن
        ];

        // جدول العمليات (أحدث 20 عملية)
        $transactions = $user->transactions()
            ->latest()
            ->limit(20)
            ->get();

        return response()->json([
            'stats' => $stats,
            'transactions' => $transactions
        ]);
    }

    // 2. الرصيد فقط (لتحديث الهيدر بسرعة بعد كل عملية)
    public function balance(Request $request)
    {
        return response()->json(['balance' => $request->user()->wallet_balance]);
    }
}
