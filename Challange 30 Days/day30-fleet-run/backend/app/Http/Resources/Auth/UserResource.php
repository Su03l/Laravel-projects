<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'driver_details' => $this->when($this->role === 'driver' && $this->driver, function () {
                return [
                    'license_number' => $this->driver->license_number,
                    'status' => $this->driver->status,
                    'current_vehicle_id' => $this->driver->current_vehicle_id,
                ];
            }),
        ];
    }
}
