<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\products>
 */
class ProductsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true), // اسم منتج من كلمتين
            'price' => fake()->randomFloat(2, 10, 3000), // سعر عشوائي
            'stock' => fake()->numberBetween(1, 100), // مخزون
        ];
    }
}
