<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{

    public function index(Request $request)
    {
        $orders = $request->user()->orders()->with('items.product')->latest()->get();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            //  1. بداية الترانزاكشن: أي شي يصير تحت هذا السطر قابل للتراجع
            DB::beginTransaction();

            $totalAmount = 0;

            // أ. إنشاء الطلب المبدئي (بدون مجموع حالياً)
            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_price' => 0, // بنحسبه بعدين
                'status' => 'pending'
            ]);

            // ب. اللف على المنتجات المطلوبة
            foreach ($request->items as $item) {
                $product = Product::lockForUpdate()->find($item['product_id']); //  نقفل المنتج عشان محد يشتريه بنفس اللحظة

                // التحقق من المخزون
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("عفواً، الكمية المطلوبة للمنتج {$product->name} غير متوفرة ");
                }

                // خصم المخزون
                $product->decrement('stock', $item['quantity']);

                // حساب السعر
                $subtotal = $product->price * $item['quantity'];
                $totalAmount += $subtotal;

                // إضافة المنتج للطلب
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ]);
            }

            // ج. تحديث المجموع النهائي للطلب
            $order->update(['total_price' => $totalAmount]);

            //  2. اعتماد الترانزاكشن (كل شي تمام)
            DB::commit();

            return response()->json(['message' => 'تم الطلب بنجاح ', 'order' => $order], 201);

        } catch (\Exception $e) {
            //  3. تراجع! صار خطأ (نلغي الطلب ونرجع المخزون زي ما كان)
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        $order = $request->user()->orders()
            ->with('items.product')
            ->findOrFail($id);

        return response()->json($order);
    }

    public function update(Request $request, string $id)
    {
        $order = $request->user()->orders()->with('items.product')->findOrFail($id);
        return response()->json($order);
    }

    public function destroy(Request $request, string $id)
    {
        $order = $request->user()->orders()->with('items.product')->findOrFail($id);

        //  شرط مهم: لا يمكن إلغاء طلب تم شحنه
        if ($order->status !== 'pending') {
            return response()->json([
                'message' => 'عفواً، لا يمكن إلغاء الطلب بعد اعتماده أو شحنه '
            ], 400);
        }

        try {
            DB::beginTransaction();

            //  استرجاع المخزون
            // نلف على كل عنصر في الطلب ونرجع كميته للمنتج الأصلي
            foreach ($order->items as $item) {
                $item->product->increment('stock', $item->quantity);
            }

            // الآن نحذف الطلب بسلام
            $order->delete();

            DB::commit();

            return response()->json(
                ['message' => 'تم إلغاء الطلب واسترجاع المخزون '
                ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'حدث خطأ أثناء الإلغاء'
            ], 500);
        }
    }
}
