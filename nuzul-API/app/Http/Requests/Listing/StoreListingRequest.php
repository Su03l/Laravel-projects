<?php

namespace App\Http\Requests\Listing;

use Illuminate\Foundation\Http\FormRequest;

class StoreListingRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'city' => 'required|string',
            'address' => 'required|string',
            'price_per_night' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string',
            'image_url' => 'nullable|url',
        ];
    }
}
