<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'       => fake()->name(),
            'email'      => fake()->unique()->safeEmail(),

            'department' => fake()->randomElement(['IT', 'HR', 'Sales', 'Marketing', 'Finance']),
            'position'   => fake()->jobTitle(),

            'salary'     => fake()->numberBetween(4000, 30000),

            'joined_at'  => fake()->dateTimeBetween('-5 years', 'now'),
        ];
    }
}
