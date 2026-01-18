<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::latest('transaction_date');

        // فلتر بالشهر (اختياري)
        if ($request->has('month')) {
            $query->whereMonth('transaction_date', $request->month);
        }

        // فلتر بالسنة (اختياري)
        if ($request->has('year')) {
            $query->whereYear('transaction_date', $request->year);
        }

        // فلتر بالنوع (income أو expense)
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:1',
            'type' => 'required|in:income,expense',
            'transaction_date' => 'required|date'
        ]);

        $transaction = Transaction::create($data);

        return response()->json([
            'message' => 'Transaction added successfully',
            'data' => $transaction
        ], 201);
    }

    public function show($id)
    {
        $transaction = Transaction::findOrFail($id);
        return response()->json($transaction);
    }

    public function update(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'amount' => 'sometimes|numeric|min:1',
            'type' => 'sometimes|in:income,expense',
            'transaction_date' => 'sometimes|date'
        ]);

        $transaction->update($data);

        return response()->json([
            'message' => 'Transaction updated successfully',
            'data' => $transaction
        ]);
    }

    public function destroy($id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->delete();

        return response()->json([
            'message' => 'Transaction deleted successfully'
        ]);
    }

    public function stats()
    {
        // حساب مجموع الدخل
        $totalIncome = Transaction::where('type', 'income')->sum('amount');

        // حساب مجموع المصروفات
        $totalExpense = Transaction::where('type', 'expense')->sum('amount');

        // الرصيد الحالي
        $balance = $totalIncome - $totalExpense;

        // عدد العمليات
        $count = Transaction::count();

        return response()->json([
            'total_income' => $totalIncome,
            'total_expense' => $totalExpense,
            'balance' => $balance,
            'transaction_count' => $count,
            'status' => $balance >= 0 ? 'Good 🟢' : 'Danger 🔴'
        ]);
    }
}
