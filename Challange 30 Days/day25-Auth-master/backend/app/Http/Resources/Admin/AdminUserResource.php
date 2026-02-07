<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminUserResource extends JsonResource
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
            'role_badge' => $this->role, // يرجع 'admin' او 'user'
            'current_status' => $this->status, // 'pending', 'active'
            'is_verified' => $this->otp_verified_at !== null, // True/False
            'verified_at' => $this->otp_verified_at?->format('Y-m-d H:i'),
            'contact' => [
                'email' => $this->email,
                'phone' => $this->phone,
            ],
            'registered_since' => $this->created_at->diffForHumans(),
        ];
    }
}
