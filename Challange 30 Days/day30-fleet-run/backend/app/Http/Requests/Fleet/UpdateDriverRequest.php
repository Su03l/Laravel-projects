<?php

namespace App\Http\Requests\Fleet;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDriverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'license_number' => 'sometimes|string',
            'status' => 'sometimes|in:online,offline,busy',
            'current_vehicle_id' => 'nullable|exists:vehicles,id',
        ];
    }
}
