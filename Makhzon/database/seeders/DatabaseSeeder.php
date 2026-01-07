<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        User::truncate();
        Category::truncate();
        Supplier::truncate();
        Product::truncate();
        Transaction::truncate();

        Schema::enableForeignKeyConstraints();

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'),
        ]);
        User::factory(9)->create();

        $categories = Category::factory(10)->create();
        $suppliers = Supplier::factory(10)->create();

        $products = Product::factory(200)->make()->each(function ($product) use ($categories, $suppliers) {
            $product->category_id = $categories->random()->id;
            $product->supplier_id = $suppliers->random()->id;
            $product->save();
        });

        for ($i = 0; $i < 100; $i++) {
            Transaction::create([
                'product_id' => $products->random()->id,
                'user_id' => User::inRandomOrder()->first()->id,
                'type' => rand(0, 1) ? 'in' : 'out',
                'quantity' => rand(1, 20),
                'notes' => 'حركة تجريبية',
            ]);
        }
    }
}
