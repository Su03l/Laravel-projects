<?php

namespace Database\Seeders;

use App\Models\orders;
use App\Models\products;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. ننشئ 10 منتجات
        $products = products::factory(10)->create();

        // 2. ننشئ 5 طلبات
        $orders = orders::class::factory(5)->create();

        // 3. نربط كل طلب بمنتجات عشوائية (مع الكمية)
        foreach ($orders as $order) {

            // نختار منتجين أو 3 عشوائيين من المنتجات اللي أنشأناها فوق
            $randomProducts = $products->random(rand(2, 3));

            foreach ($randomProducts as $product) {
                //  هنا اللعبة: نربط المنتج بالطلب ونحدد الكمية في الجدول الوسيط
                $order->products()->attach($product->id, [
                    'quantity' => rand(1, 5) // كمية عشوائية بين 1 و 5
                ]);
            }
        }
    }
}
