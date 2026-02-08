<?php

namespace App\DTOs;

use Illuminate\Http\Request;

class CreateBookingDTO
{
    public function __construct(
        public readonly int $room_id,
        public readonly int $package_id,
        public readonly string $check_in,
        public readonly string $check_out,
        public readonly ?string $notes = null,
        public readonly ?string $coupon_code = null,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            room_id: $request->integer('room_id'),
            package_id: $request->integer('package_id'),
            check_in: $request->string('check_in'),
            check_out: $request->string('check_out'),
            notes: $request->input('notes'),
            coupon_code: $request->input('coupon_code'),
        );
    }
}
