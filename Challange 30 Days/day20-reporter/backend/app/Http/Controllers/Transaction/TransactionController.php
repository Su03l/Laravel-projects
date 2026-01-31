<?php

namespace App\Http\Controllers\Transaction;

use App\Exports\TransactionsExport;
use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class TransactionController extends Controller
{
    private function getArabicConverter()
    {
        if (class_exists('\ArPHP\I18N\Arabic')) {
            return new \ArPHP\I18N\Arabic('Glyphs');
        } elseif (class_exists('\I18N_Arabic')) {
            return new \I18N_Arabic('Glyphs');
        }
        return null;
    }

    private function fixArabicText($text)
    {
        $arabic = $this->getArabicConverter();
        if (!$arabic || empty($text)) return $text;

        // تشكيل الحروف (Reshaping)
        $reshaped = $arabic->utf8Glyphs($text);

        // إعادة قلب النص لأن utf8Glyphs تقوم بقلبه تلقائياً ونحن نريده بوضعه الطبيعي لـ RTL
        return implode('', array_reverse(preg_split('//u', $reshaped, -1, PREG_SPLIT_NO_EMPTY)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'type' => 'required|in:income,expense',
            'company_name' => 'required|string|max:255',
            'date' => 'required|date'
        ]);

        $transaction = $request->user()->transactions()->create($validated);

        return response()->json([
            'message' => 'تم حفظ الفاتورة بنجاح',
            'data' => $transaction
        ]);
    }

    public function index(): JsonResponse
    {
        $transactions = Transaction::query()
            ->with('user:id,name')
            ->latest()
            ->get();

        return response()->json($transactions);
    }

    public function downloadInvoice(int $id)
    {
        $transaction = Transaction::query()->with('user')->findOrFail($id);

        $transaction->title = $this->fixArabicText($transaction->title);
        $transaction->company_name = $this->fixArabicText($transaction->company_name);

        if ($transaction->user) {
            $transaction->user->name = $this->fixArabicText($transaction->user->name);
        }

        $pdf = Pdf::loadView('reports.invoice', ['t' => $transaction]);
        return $pdf->download("invoice_$id.pdf");
    }

    public function exportExcel(): BinaryFileResponse
    {
        return Excel::download(new TransactionsExport, 'finance_report.xlsx');
    }

    public function stats(): JsonResponse
    {
        $income = Transaction::query()->where('type', 'income')->sum('amount');
        $expense = Transaction::query()->where('type', 'expense')->sum('amount');
        $count = Transaction::count();

        return response()->json([
            'total_income' => (float) $income,
            'total_expense' => (float) $expense,
            'net_profit' => (float) ($income - $expense),
            'transactions_count' => $count
        ]);
    }
}
