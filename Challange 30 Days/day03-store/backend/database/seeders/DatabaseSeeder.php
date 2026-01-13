<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
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
        $categoryNames = [
            'ألعاب',
            'أفلام سينما',
            'مسلسلات',
            'مسرح',
            'حجز تذاكر',
            'أونلاين'
        ];

        foreach ($categoryNames as $name) {
            $category = Category::create(['name' => $name]);

            if ($name === 'أونلاين') {
                Product::factory(10)->create([
                    'stock' => 999999,
                    'price' => 50.00
                ])->each(function ($product) use ($category) {
                    $product->categories()->attach($category->id);
                });
            } else {
                Product::factory(5)->create()->each(function ($product) use ($category) {
                    $product->categories()->attach($category->id);
                });
            }
        }
    }
}
