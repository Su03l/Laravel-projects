<?php

namespace App\Http\Resources\Fleet;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'plate_number' => $this->plate_number,
            'type' => $this->type,
            'capacity' => $this->capacity_kg . ' KG',
            'status' => $this->status,
            'current_driver' => $this->driver ? $this->driver->user->name : null,
        ];
    }
}
