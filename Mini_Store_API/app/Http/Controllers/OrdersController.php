<?php

namespace App\Http\Controllers;

use App\Models\orders;
use App\Http\Requests\StoreordersRequest;
use App\Http\Requests\UpdateordersRequest;
use App\Models\products;
use Illuminate\Support\Facades\DB;

class OrdersController extends Controller
{

    public function index()
    {
        $order = orders::with('products')->get();
        return response()->json($order);
    }

    public function store(StoreordersRequest $request)
    {
        return DB::transaction(function () use ($request) {

            $generatedOrderNumber = 'ORD-' . date('Ymd') . '-' . rand(1000, 9999);

            $order = orders::create([
                'customer_name' => $request->customer_name,
                'order_number' => $generatedOrderNumber,
            ]);

            foreach ($request->products as $item) {
                $product = products::find($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    throw new \Exception("عذراً، الكمية غير متوفرة للمنتج: " . $product->name);
                }

                $order->products()->attach($item['product_id'], [
                    'quantity' => $item['quantity']
                ]);

                $product->decrement('stock', $item['quantity']);
            }

            return response()->json([
                'message' => 'تم إنشاء الطلب وخصم الكمية من المخزون ',
                'order' => $order->load('products')
            ], 201);

        });
    }


    public function show(orders $order)
    {
        return response()->json($order->load('products'));
    }

    public function update(UpdateordersRequest $request, orders $order)
    {
        $order->update($request->only(['customer_name', 'order_number']));

        if ($request->has('products')) {
            $syncData = [];
            foreach ($request->products as $item) {
                $syncData[$item['product_id']] = ['quantity' => $item['quantity']];
            }
        }

        $order->products()->sync($syncData);

        return response()->json([
            'message' => 'تم تحديث الطلب بنجاح',
            'order' => $order->load('products')
        ]);
    }

    public function destroy(orders $order)
    {
        DB::transaction(function () use ($order) {
            foreach ($order->products as $product) {
                $product->increment('stock', $product->pivot->quantity);
            }
            $order->delete();
        });
        return response()->json([
            'message' => 'تم حذف الطلب وإرجاع الكميات للمخزون بنجاح ️'
        ]);
    }
}
