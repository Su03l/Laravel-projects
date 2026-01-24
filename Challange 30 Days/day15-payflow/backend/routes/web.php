<?php

use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Transaction;

Route::get('/', function () {
    $stats = [
        'users' => User::count(),
        'transactions' => Transaction::count(),
        'volume' => Transaction::where('status', 'success')->sum('amount'),
    ];

    $latestTransactions = Transaction::with(['sender', 'receiver'])
        ->latest()
        ->take(5)
        ->get();

    return view('welcome', compact('stats', 'latestTransactions'));
});
