<?php

namespace App\Http\Controllers;

use App\Exports\ProductsExport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    /**
     * Download Inventory Report
     * *هذا بيعطيك ملف فيه جرد كامل بملف اكسل.
     *
     * @response 200 binary file contents (inventory.xlsx)
     * @header Content-Type application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
     * @header Content-Disposition attachment; filename="inventory.xlsx"
     */
    public function exportInventory()
    {
        $fileName = 'inventory_' . date('Y-m-d') . '.xlsx';

        return Excel::download(new ProductsExport, $fileName);
    }
}
