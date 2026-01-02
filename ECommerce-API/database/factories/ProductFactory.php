<?php

namespace Database\Factories;

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
        return [
            'name' => fake()->commerce()->productName(),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 10, 5000), // سعر عشوائي
            'stock' => fake()->numberBetween(0, 100),
            'image' => fake()->imageUrl(), // رابط صورة وهمي
        ];
    }
}
