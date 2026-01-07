<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\Supplier\SupplierController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Transaction\TransactionController;
use App\Http\Controllers\DashboardController;

use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('suppliers', SupplierController::class);

    Route::apiResource('products', ProductController::class);

    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);

//     هذا يا طويل العمر يسويلك تقرير اكسل ويتحمل بعد
    Route::get('/reports/inventory', [ReportController::class, 'exportInventory']);

});
