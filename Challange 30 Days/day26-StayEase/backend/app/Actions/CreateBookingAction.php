<?php

namespace App\Actions;

use App\Models\User;
use App\Models\Room;
use App\Models\Package;
use App\Models\Booking;
use App\Enums\BookingStatus;
use App\DTOs\CreateBookingDTO;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingConfirmationMail;
use Illuminate\Support\Facades\Log;

class CreateBookingAction
{
    public function __construct(
        protected CheckAvailabilityAction $checkAvailability,
        protected CalculateBookingPriceAction $calculatePrice
    ) {}

    public function execute(User $user, CreateBookingDTO $data): Booking
    {
        $room = Room::findOrFail($data->room_id);
        $package = Package::findOrFail($data->package_id);

        if (!$this->checkAvailability->execute($room, $data->check_in, $data->check_out)) {
            throw ValidationException::withMessages([
                'room_id' => ['عذراً، هذه الغرفة محجوزة في التواريخ المختارة.'],
            ]);
        }

        $priceData = $this->calculatePrice->execute(
            $room,
            $package,
            $data->check_in,
            $data->check_out,
            $data->coupon_code
        );

        $booking = Booking::create([
            'user_id' => $user->id,
            'room_id' => $room->id,
            'package_id' => $package->id,
            'check_in' => $data->check_in,
            'check_out' => $data->check_out,
            'total_price' => $priceData['total_price'],
            'status' => BookingStatus::CONFIRMED,
            'notes' => $data->notes,
            'coupon_code' => $data->coupon_code,
            'discount_amount' => $priceData['discount'],
        ]);

        try {
            $booking->load(['user', 'room', 'package']);
            Mail::to($user->email)->send(new BookingConfirmationMail($booking));
        } catch (\Exception $e) {
            Log::error("فشل إرسال تأكيد الحجز: " . $e->getMessage());
        }

        return $booking;
    }
}
