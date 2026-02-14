<?php

namespace App\Http\Resources\Fleet;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DriverResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->user->name,
            'email' => $this->user->email,
            'license_number' => $this->license_number,
            'status' => $this->status,
            'location' => [
                'lat' => $this->current_lat,
                'lng' => $this->current_lng,
                'last_update' => $this->last_location_update,
            ],
            'vehicle' => new VehicleResource($this->vehicle),
        ];
    }
}
