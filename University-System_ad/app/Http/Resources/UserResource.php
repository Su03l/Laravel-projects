<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'full_name' => $this->name,
            'university_id' => $this->university_id,
            'email' => $this->email,
            'type' => $this->role,
            'advisor_name' => $this->advisor ? $this->advisor->name : 'No Advisor',
        ];
    }
}
