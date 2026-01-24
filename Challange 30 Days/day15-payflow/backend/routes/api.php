<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BeneficiaryController;
use App\Http\Controllers\Transfer\TransferController;
use App\Http\Controllers\User\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [UserController::class, 'show']);
    Route::put('/me', [UserController::class, 'update']);

    Route::get('/beneficiaries', [BeneficiaryController::class, 'index']);
    Route::post('/beneficiaries', [BeneficiaryController::class, 'store']);
    Route::put('/beneficiaries/{id}', [BeneficiaryController::class, 'update']);
    Route::delete('/beneficiaries/{id}', [BeneficiaryController::class, 'destroy']);

    Route::post('/deposit', [TransferController::class, 'deposit']);   // إيداع
    Route::post('/transfer', [TransferController::class, 'transfer']); // تحويل
    Route::get('/transactions', [TransferController::class, 'history']); // كشف حساب

    Route::post('/logout', [AuthController::class, 'logout']);
});
