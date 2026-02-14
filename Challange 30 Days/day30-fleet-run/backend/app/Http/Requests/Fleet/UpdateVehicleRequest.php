<?php

namespace App\Http\Requests\Fleet;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'plate_number' => 'sometimes|string|unique:vehicles,plate_number,' . $this->vehicle->id,
            'type' => 'sometimes|in:truck,van,bike',
            'capacity_kg' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:active,maintenance',
        ];
    }
}
