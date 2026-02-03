<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Group\GroupController;
use App\Http\Controllers\Profile\ProfileController;
use App\Http\Controllers\Task\TaskController;
use App\Http\Controllers\Task\TaskInteractionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);

    Route::get('/groups', [GroupController::class, 'index']);
    Route::post('/groups', [GroupController::class, 'store']);
    Route::get('/groups/{id}', [GroupController::class, 'show']);
    Route::post('/groups/{id}/members', [GroupController::class, 'addMember']);
    Route::delete('/groups/{id}/members/{userId}', [GroupController::class, 'removeMember']);

    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::get('/tasks/{id}', [TaskController::class, 'show']);
    Route::put('/tasks/{id}', [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);

    Route::post('/tasks/{id}/comments', [TaskInteractionController::class, 'addComment']);
    Route::post('/tasks/{id}/attachments', [TaskInteractionController::class, 'uploadAttachment']);

    Route::put('/comments/{id}', [App\Http\Controllers\Task\CommentController::class, 'update']);
    Route::delete('/comments/{id}', [App\Http\Controllers\Task\CommentController::class, 'destroy']);
});
