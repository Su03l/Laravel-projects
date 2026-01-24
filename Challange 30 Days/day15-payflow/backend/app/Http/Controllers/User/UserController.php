<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'message' => 'User details retrieved successfully',
            'data' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'bank_details' => [
                    'account_number' => $user->account_number,
                    'iban' => $user->iban,
                    'current_balance' => $user->wallet_balance . ' SAR',
                ],
                'personal_info' => [
                    'national_id' => $user->national_id,
                    'dob' => $user->dob,
                ],
                'joined_at' => $user->created_at->format('Y-m-d'),
            ]
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'data' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'bank_details' => [
                    'account_number' => $user->account_number,
                    'iban' => $user->iban,
                    'current_balance' => $user->wallet_balance . ' SAR',
                ],
                'personal_info' => [
                    'national_id' => $user->national_id,
                    'dob' => $user->dob,
                ],
                'joined_at' => $user->created_at->format('Y-m-d'),
            ]
        ]);
    }
}
