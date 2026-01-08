<?php

namespace Database\Factories;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $checkIn = fake()->dateTimeBetween('now', '+1 month');

        $checkOut = fake()->dateTimeInInterval($checkIn, '+5 days');

        return [
            'user_id' => User::factory(),
            'listing_id' => Listing::factory(),
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'total_price' => fake()->numberBetween(500, 3000),
            'status' => 'confirmed',
        ];
    }
}
