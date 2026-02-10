<?php

namespace App\Http\Resources;

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
            'wallet_balance' => $this->wallet_balance,
            'two_factor_enabled' => (bool) $this->two_factor_enabled,
            'joined_at' => $this->created_at->format('Y-m-d'),
        ];
    }
}
