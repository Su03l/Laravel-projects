<?php

namespace App\Http\Resources\Listing;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'location' => [
                'city' => $this->city,
                'address' => $this->address,
            ],
            'price' => [
                'per_night' => (float)$this->price_per_night,
                'currency' => 'SAR',
            ],
            'details' => [
                'capacity' => $this->capacity . ' أشخاص',
                'amenities' => $this->amenities,
            ],
            'image' => $this->image_url,
            'host' => new UserResource($this->whenLoaded('user')),
        ];
    }
}
