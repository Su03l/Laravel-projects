<?php

namespace App\Http\Controllers\Transaction;

use App\Exports\TransactionsExport;
use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'amount' => 'required|numeric',
            'type' => 'required|in:income,expense',
            'company_name' => 'required',
            'date' => 'required|date'
        ]);

        $transaction = $request->user()->transactions()->create($request->all());

        return response()->json(
            ['message' => 'تم حفظ الفاتورة',
                'data' => $transaction]
        );
    }

    public function index()
    {
        return response()->json(Transaction::with('user:id,name')->latest()->get());
    }

    public function downloadInvoice($id)
    {
        $transaction = Transaction::findOrFail($id);
        $pdf = Pdf::loadView('reports.invoice', ['t' => $transaction]);
        return $pdf->download("invoice_{$id}.pdf");
    }

    public function exportExcel()
    {
        return Excel::download(new TransactionsExport, 'finance_report.xlsx');
    }

    public function stats()
    {
        // نحسب مجموع الدخل
        $income = Transaction::where('type', 'income')->sum('amount');

        // نحسب مجموع المصروفات
        $expense = Transaction::where('type', 'expense')->sum('amount');

        // صافي الربح
        $netProfit = $income - $expense;

        // عدد العمليات
        $count = Transaction::count();

        return response()->json([
            'total_income' => $income,
            'total_expense' => $expense,
            'net_profit' => $netProfit,
            'transactions_count' => $count
        ]);
    }
}
