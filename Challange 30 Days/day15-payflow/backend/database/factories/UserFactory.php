<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker = \Faker\Factory::create('ar_SA');

        return [
            'name' => $faker->name(),

            'email' => $faker->unique()->safeEmail(),

            'phone' => '05' . $faker->unique()->numerify('########'),

            'national_id' => $faker->unique()->regexify('[1-2][0-9]{9}'),

            'dob' => $faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),

            'password' => Hash::make('password'),


        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
