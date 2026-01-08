<?php

namespace App\Http\Resources\Booking;

use App\Http\Resources\Listing\ListingResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'period' => [
                'check_in' => $this->check_in->format('Y-m-d'),
                'check_out' => $this->check_out->format('Y-m-d'),
                'nights' => $this->check_in->diffInDays($this->check_out),
            ],
            'financials' => [
                'total_price' => (float)$this->total_price,
                'currency' => 'SAR',
            ],
            'status' => $this->status,
            'listing' => new ListingResource($this->whenLoaded('listing')),
        ];
    }
}
