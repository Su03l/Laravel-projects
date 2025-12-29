<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Property>
 */
class PropertyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title'       => fake()->words(3, true),
            'description' => fake()->realText(100),

            'price'       => fake()->numberBetween(20000, 5000000),
            'area'        => fake()->numberBetween(80, 1000),

            'city'        => fake()->randomElement(['Riyadh', 'Jeddah', 'Dammam', 'Mecca']),
            'rooms'       => fake()->numberBetween(1, 12),
            'bathrooms'   => fake()->numberBetween(1, 6),

            'type'        => fake()->randomElement(['apartment', 'villa', 'land']),
            'status'      => fake()->randomElement(['sale', 'rent']),
        ];
    }
}
