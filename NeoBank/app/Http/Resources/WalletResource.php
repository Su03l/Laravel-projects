<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WalletResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'account_holder' => [
                'name' => $this->user->name,
                'phone' => $this->user->phone,
                'email' => $this->user->email,
            ],

            'banking_details' => [
                'account_number' => $this->account_number,
                'iban' => $this->iban,
                'bank_name' => 'NeoBank Saudi Arabia',
                'branch_code' => 'NBZK-HQ',
            ],

            'financial_status' => [
                'balance' => (float)$this->balance,
                'currency' => $this->currency,
                'status' => 'Active',
            ],

            'meta' => [
                'opened_at' => $this->created_at->format('Y-m-d'),
                'last_updated' => $this->updated_at->diffForHumans(),
            ],
        ];
    }
}
