<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    use ApiResponse;

    // إنشاء فاتورة جديدة
    public function store(Request $request)
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'amount' => 'required|numeric|min:1',
        ]);

        // 1. توليد رقم الفاتورة تلقائياً (INV-TIMESTAMP-RANDOM)
        // الطريقة الاحترافية تكون: INV-2024-0001 (تسلسلي)
        // للسهولة الآن سنستخدم Random بس فريد
        $data['invoice_number'] = 'INV-' . time();
        $data['status'] = 'unpaid';

        $invoice = Invoice::create($data);

        return $this->success($invoice, 'تم إنشاء الفاتورة بنجاح', 201);
    }

    // تسجيل الفاتورة كـ مدفوعة
    public function markAsPaid(Invoice $invoice)
    {
        $invoice->update(['status' => 'paid']);
        return $this->success($invoice, 'تم سداد الفاتورة');
    }

    // عرض فواتير مشروع معين
    public function projectInvoices($projectId)
    {
        $invoices = Invoice::where('project_id', $projectId)->get();
        return $this->success($invoices);
    }
}
