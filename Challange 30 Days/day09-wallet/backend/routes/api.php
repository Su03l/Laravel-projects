<?php

use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

Route::get('/wallet/stats', [WalletController::class, 'stats']);

Route::apiResource('transactions', WalletController::class);
