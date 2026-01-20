<?php

namespace App\Http\Resources\Tweet;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TweetResource extends JsonResource
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
            'content' => $this->content,
            'author' => [
                'name' => $this->user->name,
                'username' => '@' . $this->user->username,
            ],
            'created_at' => $this->created_at->diffForHumans(),
            'is_mine' => $this->user_id === $request->user()?->id,
        ];
    }
}
