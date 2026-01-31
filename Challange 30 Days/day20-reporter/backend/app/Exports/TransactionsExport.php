<?php

namespace App\Exports;

use App\Models\Transaction;
use Maatwebsite\Excel\Concerns\FromCollection;

class TransactionsExport implements FromCollection
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        // نختار الأعمدة اللي نبيها تطلع في الإكسل
        return Transaction::select('date', 'type', 'amount', 'company_name', 'title')->get();
    }

    public function headings(): array
    {
        return ['Date', 'Type', 'Amount', 'Company', 'Description'];
    }
}
