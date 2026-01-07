<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $buyingPrice = fake()->randomFloat(2, 10, 1000);

        return [
            'name' => fake()->words(3, true),
            'sku' => fake()->unique()->numerify('SKU-#########'),
            'description' => fake()->paragraph(),

            'buying_price' => $buyingPrice,
            'selling_price' => $buyingPrice * 1.20,

            'stock' => fake()->numberBetween(0, 100),
            'min_stock_level' => 5,

            'category_id' => Category::factory(),
            'supplier_id' => Supplier::factory(),
        ];
    }
}
