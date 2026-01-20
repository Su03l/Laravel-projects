<?php

use App\Http\Controllers\Tweet\TweetController;
use App\Http\Controllers\User\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;


Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/tweets', [TweetController::class, 'index']);
Route::get('/tweets/{id}', [TweetController::class, 'show']);


Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/user/profile', [UserController::class, 'show']);
    Route::put('/user/profile', [UserController::class, 'update']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);
    Route::get('/user/tweets', [TweetController::class, 'myTweets']);

    Route::post('/tweets', [TweetController::class, 'store']);
    Route::put('/tweets/{id}', [TweetController::class, 'update']);
    Route::delete('/tweets/{id}', [TweetController::class, 'destroy']);
});
