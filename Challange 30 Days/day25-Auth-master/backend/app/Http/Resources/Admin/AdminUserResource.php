<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

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
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role, // Enum or string
            'avatar' => $this->avatar ? Storage::url($this->avatar) : null,
            'is_banned' => $this->banned_until && $this->banned_until->isFuture(),
            'created_at' => $this->created_at->format('Y-m-d'),
            // Keep old fields just in case, but structure them flat for table
            'phone' => $this->phone,
        ];
    }
}
