<?php

namespace App\Http\Requests\Fleet;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'plate_number' => 'required|string|unique:vehicles,plate_number',
            'type' => 'required|in:truck,van,bike',
            'capacity_kg' => 'required|integer|min:1',
        ];
    }
}
