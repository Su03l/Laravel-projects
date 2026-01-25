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
    protected static ?string $password;

    public function definition(): array
    {
        // Set faker to Arabic for this factory
        $fakerAr = \Faker\Factory::create('ar_SA');

        return [
            'first_name' => $fakerAr->firstName(),
            'last_name' => $fakerAr->lastName(),
            'username' => fake()->unique()->userName(), // Usernames usually stay English/Alpha-numeric
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'avatar' => 'https://i.pravatar.cc/150?u=' . fake()->uuid(),
            'remember_token' => Str::random(10),
        ];
    }
}
