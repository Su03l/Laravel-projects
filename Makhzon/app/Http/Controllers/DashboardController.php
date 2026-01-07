<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_products' => Product::count(),
            'total_categories' => Category::count(),
            'total_suppliers' => Supplier::count(),

            'inventory_value' => Product::sum(DB::raw('stock * buying_price')),

            'low_stock_count' => Product::whereColumn('stock', '<=', 'min_stock_level')->count(),

            'recent_transactions' => Transaction::with(['user', 'product'])
                ->latest()
                ->take(5)
                ->get()
        ]);
    }
}
