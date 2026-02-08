<?php

namespace App\Actions;

use App\Models\Room;
use App\Models\Package;
use App\Models\Coupon;
use Carbon\Carbon;

class CalculateBookingPriceAction
{
    public function execute(Room $room, Package $package, string $checkIn, string $checkOut, ?string $couponCode = null): array
    {
        $start = Carbon::parse($checkIn);
        $end = Carbon::parse($checkOut);
        $nights = $start->diffInDays($end) ?: 1;

        $basePrice = ($room->price_per_night * $nights) * $package->price_multiplier;

        $discount = 0;

        if ($couponCode) {
            $coupon = Coupon::where('code', $couponCode)->first();

            if ($coupon && (!$coupon->expires_at || $coupon->expires_at > now())) {
                if ($coupon->type === 'percent') {
                    $discount = $basePrice * ($coupon->value / 100);
                } else {
                    $discount = $coupon->value;
                }
            }
        }

        $finalPrice = max(0, $basePrice - $discount);

        return [
            'total_price' => $finalPrice,
            'original_price' => $basePrice,
            'discount' => $discount
        ];
    }
}
