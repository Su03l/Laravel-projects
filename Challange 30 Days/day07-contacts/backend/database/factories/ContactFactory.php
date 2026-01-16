<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contact>
 */
class ContactFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fakerAr = fake('ar_SA');

        return [
            'first_name' => $fakerAr->firstName(),
            'last_name' => $fakerAr->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'country_code' => '+966',
            'phone' => '5' . fake()->numerify('########'),
            'details' => fake()->sentence(),
        ];
    }
}
