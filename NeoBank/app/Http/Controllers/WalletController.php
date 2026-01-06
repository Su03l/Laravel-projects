<?php

namespace App\Http\Controllers;

use App\Http\Requests\Wallet\DepositRequest;
use App\Http\Requests\Wallet\TransferRequest;
use App\Http\Resources\TransactionResource;
use App\Http\Resources\WalletResource;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WalletController extends Controller
{
    public function index(Request $request)
    {
        $wallet = $request->user()->wallet;
        return new WalletResource($wallet);
    }

    public function show(Request $request)
    {
        return new WalletResource($request->user()->wallet);
    }

    public function balance(Request $request)
    {
        $wallet = $request->user()->wallet;

        return response()->json([
            'balance' => $wallet->balance,
            'currency' => $wallet->currency,
            'account_number' => $wallet->account_number
        ]);
    }

    public function history(Request $request)
    {
        $transactions = $request->user()->wallet->transactions()->latest()->paginate(10);
        return TransactionResource::collection($transactions);
    }

    public function deposit(DepositRequest $request)
    {
        $user = $request->user();
        $amount = $request->amount;

        try {
            DB::beginTransaction();

            $user->wallet()->increment('balance', $amount);

            // تسجيل العملية
            $transaction = $user->wallet->transactions()->create([
                'type' => 'deposit',
                'amount' => $amount,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Deposit successful',
                'balance' => $user->wallet->fresh()->balance,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Deposit failed'
            ], 500);
        }
    }

    public function transfer(TransferRequest $request)
    {
        $sender = $request->user();
        $input = $request->identifier;
        $amount = $request->amount;

        $receiver = User::where('email', $input)
            ->orWhere('phone', $input)
            ->orWhereHas('wallet', function ($q) use ($input) {
                $q->where('account_number', $input)->orWhere('iban', $input);
            })
            ->first();

        if (!$receiver) {
            return response()->json([
                'message' => 'User not found with provided details'
            ], 404);
        }

        if ($sender->id === $receiver->id) {
            return response()->json([
                'message' => 'You cannot transfer money to yourself'
            ], 400);
        }

        try {
            DB::beginTransaction();

            $senderWallet = Wallet::where('user_id', $sender->id)->lockForUpdate()->first();
            $receiverWallet = Wallet::where('user_id', $receiver->id)->lockForUpdate()->first();

            if ($senderWallet->balance < $amount) {
                return response()->json([
                    'message' => 'Insufficient balance'
                ], 400);
            }

            $senderWallet->decrement('balance', $amount);

            $receiverWallet->increment('balance', $amount);

            $senderWallet->transactions()->create([
                'type' => 'transfer_sent',
                'amount' => -1 * $amount,
                'related_wallet_id' => $receiverWallet->id,
            ]);

            $receiverWallet->transactions()->create([
                'type' => 'transfer_received',
                'amount' => $amount,
                'related_wallet_id' => $senderWallet->id,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Transfer successful',
                'balance' => $senderWallet->fresh()->balance
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
