<?php

namespace Database\Factories;

use App\Models\Departments;
use App\Models\Employees;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employees>
 */
class EmployeesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'department_id' => \App\Models\Departments::inRandomOrder()->first()->id ?? \App\Models\Departments::factory(),
            'role' => fake()->randomElement(['employee', 'manager', 'director']),
        ];
    }
}
