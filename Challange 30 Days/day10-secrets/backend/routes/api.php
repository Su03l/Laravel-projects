<?php

use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthController;

//  Public Routes (Auth)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

//  Protected Routes (User & Logout)
Route::middleware('auth:sanctum')->group(function () {

    // Auth Actions
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // User Profile Actions
    Route::get('/user/profile', [UserController::class, 'show']);
    Route::put('/user/profile', [UserController::class, 'update']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);
});
