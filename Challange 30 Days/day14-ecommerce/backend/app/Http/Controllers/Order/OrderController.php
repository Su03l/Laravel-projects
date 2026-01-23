<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // start the transaction
        DB::beginTransaction();

        try {
            $totalAmount = 0;

            // إنشاء الطلب المبدئي
            $order = Order::create([
                'user_id' => Auth::id(),
                'total_price' => 0,
                'status' => 'pending'
            ]);

            foreach ($request->items as $item) {
                // lockForUpdate: يمنع أي شخص آخر من شراء نفس المنتج في نفس اللحظة
                $product = Product::lockForUpdate()->find($item['product_id']);

                // أ) فحص الكمية
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("عفواً، المنتج {$product->name} نفذت كميته أو غير كافية.");
                }

                // ب) خصم المخزون
                $product->decrement('stock', $item['quantity']);

                // ج) حساب السعر وتسجيل المنتج في الفاتورة
                $totalAmount += $product->price * $item['quantity'];

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ]);
            }

            // تحديث السعر النهائي
            $order->update(['total_price' => $totalAmount]);

            //  اعتماد العملية
            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order
            ], 201);

        } catch (\Exception $e) {
            //  تراجع في حالة الخطأ
            DB::rollBack();
            return response()->json([
                'message' => 'Order failed',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function index(Request $request)
    {
        $orders = $request->user()->orders()->with('items.product')->latest()->get();
        return response()->json($orders);
    }

    public function show($id)
    {
        $user = Auth::user();

        $order = Order::with(['items.product'])->findOrFail($id);

        //  حماية: ممنوع تشوف طلب غيرك إلا لو كنت أدمن
        if ($user->role !== 'admin' && $order->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json($order);
    }

    // 3. إلغاء الطلب  - إرجاع المخزون
    public function cancel($id)
    {
        $user = Auth::user();

        // البحث عن الطلب
        $order = Order::with('items')->findOrFail($id);

        // التحقق: هل اليوزر هو صاحب الطلب؟ (إلا لو كان أدمن عادي يقدر يلغي أي شي)
        if ($user->role !== 'admin' && $order->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // التحقق: لا يمكن إلغاء طلب تم إلغاؤه مسبقاً
        if ($order->status === 'cancelled') {
            return response()->json(['message' => 'Order is already cancelled'], 400);
        }

        //  بداية الترانزاكشن للإلغاء
        DB::beginTransaction();

        try {
            // 1. إرجاع الكميات للمخزون (Loop على المنتجات)
            foreach ($order->items as $item) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $product->increment('stock', $item->quantity); // ✅ رجعنا البضاعة للرف
                }
            }

            // 2. تغيير حالة الطلب
            $order->update(['status' => 'cancelled']);

            //  اعتماد
            DB::commit();

            return response()->json(['message' => 'Order cancelled and stock restored successfully']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to cancel order'], 500);
        }
    }

    public function getAllOrders()
    {
        $orders = Order::with(['user', 'items.product'])->latest()->get();
        return response()->json($orders);
    }

}

