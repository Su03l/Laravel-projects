<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReplyController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);


    Route::get('/profile', [UserController::class, 'me']);
    Route::put('/profile', [UserController::class, 'updateProfile']);


    Route::apiResource('tickets', TicketController::class);


    Route::apiResource('tickets.replies', ReplyController::class)
        ->only(['index', 'store']);


    Route::middleware(['admin'])->group(function () {

        Route::apiResource('users', UserController::class);


    });

});
