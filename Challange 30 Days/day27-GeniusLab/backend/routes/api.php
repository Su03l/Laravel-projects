<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AdminController;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-account', [AuthController::class, 'verifyAccount']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login/verify', [AuthController::class, 'loginVerify']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {

    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);

    // User Profile
    Route::get('/user', [ProfileController::class, 'show']);
    Route::put('/user/profile', [ProfileController::class, 'update']);
    Route::post('/user/2fa', [ProfileController::class, 'toggleTwoFactor']);

    // Wallet & Transactions
    Route::get('/wallet', [WalletController::class, 'index']);
    Route::get('/wallet/balance', [WalletController::class, 'balance']);

    // Payments
    Route::get('/packages', [PaymentController::class, 'index']);
    Route::post('/purchase', [PaymentController::class, 'purchase']);

    // AI Generation
    Route::get('/models', [AiController::class, 'models']);
    Route::post('/generate', [AiController::class, 'generate']);
    Route::post('/generate/image', [AiController::class, 'generateImage']);
    Route::post('/generate/audio', [AiController::class, 'generateAudio']);

    // Templates
    Route::get('/templates', [TemplateController::class, 'index']);
    Route::post('/templates/{id}/generate', [TemplateController::class, 'generate']);

    // Chat History & Search
    Route::get('/chats', [ChatController::class, 'index']);
    Route::get('/chats/search', [ChatController::class, 'search']); // 🔍 بحث
    Route::get('/chats/{id}', [ChatController::class, 'show']);
    Route::delete('/chats/{id}', [ChatController::class, 'destroy']);

    // Admin Stats (يمكنك إضافة middleware 'admin' لاحقاً)
    Route::get('/admin/stats', [AdminController::class, 'stats']);

});
