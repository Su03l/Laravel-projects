<?php

namespace App\Actions;

use App\Models\Booking;
use App\Models\Service;
use App\Enums\BookingStatus;
use Illuminate\Validation\ValidationException;

class OrderRoomServiceAction
{
    public function execute(Booking $booking, int $serviceId, int $quantity): void
    {
        if (!in_array($booking->status, [BookingStatus::CONFIRMED])) {
             if ($booking->status === BookingStatus::CANCELLED || $booking->status === BookingStatus::COMPLETED) {
                 throw ValidationException::withMessages(['booking_id' => ['لا يمكن طلب خدمات لهذا الحجز.']]);
             }
        }

        $service = Service::findOrFail($serviceId);

        $booking->services()->attach($service->id, [
            'quantity' => $quantity,
            'price_at_order' => $service->price,
            'status' => 'ordered'
        ]);
    }
}
