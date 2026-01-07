<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Http\Resources\Transaction\TransactionResource;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with(['product', 'user'])
            ->latest()
            ->paginate(20);

        return TransactionResource::collection($transactions);
    }

    public function store(StoreTransactionRequest $request)
    {
        return DB::transaction(function () use ($request) {

            $product = Product::lockForUpdate()->find($request->product_id);

            if ($request->type === 'out') {
                if ($product->stock < $request->quantity) {
                    abort(400, 'الكمية المتوفرة في المستودع غير كافية!');
                }
                $product->decrement('stock', $request->quantity);
            } else {
                $product->increment('stock', $request->quantity);
            }

            $transaction = Transaction::create([
                'product_id' => $request->product_id,
                'user_id' => $request->user()->id,
                'type' => $request->type,
                'quantity' => $request->quantity,
                'notes' => $request->notes
            ]);

            return response()->json([
                'message' => 'تم تسجيل الحركة وتحديث المخزون بنجاح',
                'transaction' => new TransactionResource($transaction->load(['product', 'user'])),
                'new_stock' => $product->stock
            ], 201);
        });
    }
}
