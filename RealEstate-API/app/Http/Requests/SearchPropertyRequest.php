<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchPropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'city'      => 'nullable|string|max:255',
            'type'      => 'nullable|string|in:apartment,villa,land',
            'status'    => 'nullable|string|in:sale,rent',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',
            'rooms'     => 'nullable|integer|min:1',
            'area'      => 'nullable|integer|min:1',
        ];
    }
}
