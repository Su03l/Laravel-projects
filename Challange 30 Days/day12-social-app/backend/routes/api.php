<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Tweet\TweetController;
use App\Http\Controllers\Follow\FollowController;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/tweets', [TweetController::class, 'index']);
Route::get('/tweets/{id}', [TweetController::class, 'show']);
Route::get('/users/{username}', [UserController::class, 'getUserByUsername']);
Route::get('/users-suggested', [UserController::class, 'getSuggestedUsers']);


Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/user/profile', [UserController::class, 'show']);
    Route::put('/user/profile', [UserController::class, 'update']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);

    Route::post('/tweets', [TweetController::class, 'store']);
    Route::put('/tweets/{id}', [TweetController::class, 'update']);
    Route::delete('/tweets/{id}', [TweetController::class, 'destroy']);

    Route::post('/follow', [FollowController::class, 'store']);
    Route::delete('/unfollow/{id}', [FollowController::class, 'destroy']);
});
