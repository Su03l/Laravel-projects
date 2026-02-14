<?php

namespace App\Http\Resources\Operations;

use App\Http\Resources\Fleet\DriverResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShipmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tracking_number' => $this->tracking_number,
            'status' => $this->status,
            'pickup' => [
                'address' => $this->pickup_address,
                'lat' => $this->pickup_lat,
                'lng' => $this->pickup_lng,
            ],
            'delivery' => [
                'address' => $this->delivery_address,
                'lat' => $this->delivery_lat,
                'lng' => $this->delivery_lng,
            ],
            'driver' => $this->driver ? new DriverResource($this->driver) : null,
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
