<?php

namespace App\Actions;

use App\Models\Room;
use App\Enums\BookingStatus;

class CheckAvailabilityAction
{
    public function execute(Room $room, string $checkIn, string $checkOut): bool
    {
        return !$room->bookings()
            ->where('status', '!=', BookingStatus::CANCELLED)
            ->where(function ($query) use ($checkIn, $checkOut) {
                $query->where('check_in', '<', $checkOut)
                      ->where('check_out', '>', $checkIn);
            })
            ->exists();
    }
}
