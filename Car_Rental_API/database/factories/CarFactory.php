<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Car>
 */
class CarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['Toyota Camry', 'Honda Accord', 'Hyundai Sonata', 'Ford Taurus']),
            'model_year' => fake()->year(),
            'license_plate' => strtoupper(fake()->bothify('???-####')),
            'daily_price' => fake()->randomFloat(2, 100, 500),
            'status' => 'available',
        ];
    }
}
