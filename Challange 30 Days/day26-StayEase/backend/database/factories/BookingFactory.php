<?php

namespace Database\Factories;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition(): array
    {
        $checkIn = fake()->dateTimeBetween('-2 months', '+1 month');
        $checkOut = (clone $checkIn)->modify('+' . rand(1, 7) . ' days');

        // Determine status based on date
        $status = BookingStatus::CONFIRMED;
        if ($checkOut < now()) {
            $status = BookingStatus::COMPLETED;
        } elseif ($checkIn > now()) {
            $status = BookingStatus::CONFIRMED;
        } else {
            // Currently checked in (we don't have a specific status for this, so CONFIRMED is fine)
            $status = BookingStatus::CONFIRMED;
        }

        // 10% chance of being cancelled
        if (rand(1, 100) <= 10) {
            $status = BookingStatus::CANCELLED;
        }

        return [
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'total_price' => fake()->numberBetween(500, 5000),
            'status' => $status,
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
