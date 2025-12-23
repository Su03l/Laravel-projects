<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\phonenumber>
 */
class PhonenumberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'=> fake()->name(),
            'email'=> fake()->unique()->safeEmail(),
            'number'=>fake()->unique()->phoneNumber(),
            'relation' => fake()->randomElement(['Family', 'Friend', 'Work', 'VIP']),
        ];
    }
}
