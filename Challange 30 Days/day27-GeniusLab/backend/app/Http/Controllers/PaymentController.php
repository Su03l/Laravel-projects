<?php

namespace App\Http\Controllers;

use App\Models\CreditPackage;
use App\Models\Transaction;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    use ApiResponse;

    // List all credit packages
    public function index()
    {
        $packages = CreditPackage::all();
        return $this->success($packages);
    }

    // Mock Purchase (Simulate Payment Gateway)
    public function purchase(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:credit_packages,id',
        ]);

        $package = CreditPackage::findOrFail($request->package_id);
        $user = $request->user();

        // Simulate Payment Processing... 
        // In a real app, here we would call Stripe/PayPal API.

        DB::transaction(function () use ($user, $package) {
            // 1. Add Credits to Wallet
            $user->increment('wallet_balance', $package->credits);

            // 2. Log Transaction
            Transaction::create([
                'user_id' => $user->id,
                'type' => 'deposit',
                'credits' => $package->credits,
                'description' => "Purchased {$package->name}",
            ]);
        });

        return $this->success([
            'new_balance' => $user->fresh()->wallet_balance,
        ], "Successfully purchased {$package->name}. Credits added.");
    }
}
