<?php

namespace App\Http\Controllers;

use App\Models\Beneficiary;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BeneficiaryController extends Controller
{
    public function index()
    {
        $beneficiaries = Beneficiary::where('user_id', Auth::id())
            ->with('beneficiaryUser')
            ->get()
            ->map(function ($b) {
                return [
                    'id' => $b->id,
                    'name' => $b->beneficiaryUser->name,
                    'alias_name' => $b->alias_name,
                    'account_number' => $b->beneficiaryUser->account_number,
                    'iban' => $b->beneficiaryUser->iban,
                ];
            });

        return response()->json([
            'message' => 'Beneficiaries retrieved successfully',
            'data' => $beneficiaries
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'search_type' => 'required|in:phone,account_number,iban,email',
            'search_value' => 'required|string',
            'alias_name' => 'nullable|string|max:50'
        ]);

        $column = $request->search_type;
        $beneficiaryUser = User::where($column, $request->search_value)->first();

        if (!$beneficiaryUser) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        if ($beneficiaryUser->id === Auth::id()) {
            return response()->json([
                'message' => 'You cannot add yourself as a beneficiary'
            ], 400);
        }

        // Check if already exists
        $exists = Beneficiary::where('user_id', Auth::id())
            ->where('beneficiary_user_id', $beneficiaryUser->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Beneficiary already added'
            ], 400);
        }

        $beneficiary = Beneficiary::create([
            'user_id' => Auth::id(),
            'beneficiary_user_id' => $beneficiaryUser->id,
            'alias_name' => $request->alias_name,
        ]);

        return response()->json([
            'message' => 'Beneficiary added successfully',
            'data' => $beneficiary
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'alias_name' => 'nullable|string|max:50'
        ]);

        $beneficiary = Beneficiary::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $beneficiary->update([
            'alias_name' => $request->alias_name
        ]);

        return response()->json([
            'message' => 'Beneficiary updated successfully',
            'data' => $beneficiary
        ]);
    }

    public function destroy($id)
    {
        $beneficiary = Beneficiary::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $beneficiary->delete();

        return response()->json([
            'message' => 'Beneficiary deleted successfully'
        ]);
    }
}
