<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TodoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Protected API Routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Route to get the current user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Route to update user profile
    Route::put('/user/profile', [ProfileController::class, 'update']);

    // Route to update user password
    Route::put('/user/password', [ProfileController::class, 'updatePassword']);

    // Todo resource routes
    Route::apiResource('todos', TodoController::class);
});
