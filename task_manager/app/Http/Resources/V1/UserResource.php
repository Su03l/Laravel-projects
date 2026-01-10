<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'full_name' => $this->first_name . ' ' . $this->last_name, // دمجنا الاسم للعرض
            'email' => $this->email,
            'joined_at' => $this->created_at->format('Y-m-d'),
        ];
    }
}
