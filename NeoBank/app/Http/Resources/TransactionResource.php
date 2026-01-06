<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'reference_id' => $this->uuid,
            'type' => $this->type,
            'amount' => $this->amount . ' ' . $this->wallet->currency,
            'date' => $this->created_at->format('Y-m-d H:i:s'),

            'related_party' => $this->when($this->relatedWallet, function () {
                return $this->relatedWallet->user->name;
            }),
        ];
    }
}
