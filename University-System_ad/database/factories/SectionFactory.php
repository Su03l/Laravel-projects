<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Section>
 */
class SectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startTimes = ['08:00:00', '10:00:00', '13:00:00'];
        $selectedStart = fake()->randomElement($startTimes);

        return [
            'section_number' => fake()->numerify('###'),
            'days' => fake()->randomElement(['STT', 'MW']),
            'time_start' => $selectedStart,
            'time_end' => \Carbon\Carbon::parse($selectedStart)->addHour()->format('H:i:s'), // مدة المحاضرة ساعة
            'professor_name' => 'Dr. ' . fake()->lastName(),
            'capacity' => fake()->numberBetween(20, 40),
        ];
    }
}
