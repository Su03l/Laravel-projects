<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\courses>
 */
class CoursesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->unique()->randomElement([
                'Computer Science',
                'Mathematics',
                'Physics',
                'Chemistry',
                'Biology',
                'History',
                'English Literature',
                'Psychology',
                'Economics',
                'Business Administration'
            ]),

            'code' => fake()->unique()->bothify('??-###'),

        ];
    }
}
