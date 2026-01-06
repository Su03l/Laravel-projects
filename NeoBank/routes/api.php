<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\WalletController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// for Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// for Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {

    // for Authenticated Routes
    Route::post('/logout', [AuthController::class, 'logout']);


    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);

    Route::get('/wallet', [WalletController::class, 'show']); // الرصيد
    Route::get('/wallet/balance', [WalletController::class, 'balance']);
    Route::get('/wallet/history', [WalletController::class, 'history']); // العمليات
    Route::post('/wallet/deposit', [WalletController::class, 'deposit']); // إيداع
    Route::post('/wallet/transfer', [WalletController::class, 'transfer']); // تحويل
});
