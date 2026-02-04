<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\chat\ChatController;
use App\Http\Controllers\Message\MessageController;
use App\Http\Controllers\User\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me', [ProfileController::class, 'me']);
    Route::get('/users/{id}', [ProfileController::class, 'show']); // New: عرض بروفايل مستخدم آخر
    Route::post('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/pin', [ProfileController::class, 'setChatPin']);

    // Chat Routes
    Route::post('/chat/check-number', [ChatController::class, 'checkNumber']);
    Route::post('/chat', [ChatController::class, 'startChat']);

    // Group Routes
    Route::post('/groups', [ChatController::class, 'createGroup']);
    Route::post('/groups/{id}', [ChatController::class, 'updateGroup']);

    // Conversation Management
    Route::get('/conversations', [ChatController::class, 'index']);
    Route::delete('/conversations/{id}', [ChatController::class, 'destroy']);
    Route::post('/conversations/{id}/lock', [ChatController::class, 'toggleLock']);

    // Messages Routes
    Route::get('/conversations/{id}/messages', [MessageController::class, 'index']);
    Route::post('/conversations/{id}/messages', [MessageController::class, 'store']);
    Route::post('/conversations/{id}/read', [MessageController::class, 'markAsRead']);

    Route::put('/messages/{id}', [MessageController::class, 'update']);
    Route::delete('/messages/{id}', [MessageController::class, 'destroy']);

    // Broadcasting Auth
    Route::post('/broadcasting/auth', function (Request $request) {
        return Broadcast::auth($request);
    });
});
