<?php

use App\Http\Controllers\Article\ArticleController;
use App\Http\Controllers\Article\NewsController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\Comment\CommentController;
use App\Http\Controllers\Media\MediaController;
use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public View Routes
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

// External News API
Route::get('/external-news', [NewsController::class, 'index']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);

    // User Profile
    Route::get('/user/profile', [UserController::class, 'show']);
    Route::put('/user/profile', [UserController::class, 'update']);

    // Articles (Actions)
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::put('/articles/{id}', [ArticleController::class, 'update']);
    Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);

    // Comments (Actions)
    Route::post('/articles/{article_id}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    // Categories (Actions)
    Route::post('/categories', [CategoryController::class, 'store']);

    // Media
    Route::post('/media/upload', [MediaController::class, 'upload']);
    Route::delete('/media/delete', [MediaController::class, 'destroy']);
});
