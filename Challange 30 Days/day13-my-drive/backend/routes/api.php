<?php

use App\Http\Controllers\File\FileController;
use App\Http\Controllers\Folder\FolderController;
use App\Http\Controllers\User\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;


Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/user/profile', [UserController::class, 'show']);
    Route::put('/user/profile', [UserController::class, 'update']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);

    Route::get('/folders', [FolderController::class, 'index']);
    Route::post('/folders', [FolderController::class, 'store']);
    Route::get('/folders/{id}', [FolderController::class, 'show']);
    Route::delete('/folders/{id}', [FolderController::class, 'destroy']);

    Route::get('/files', [FileController::class, 'index']);
    Route::post('/files/upload', [FileController::class, 'store']);
    Route::get('/files/{id}/download', [FileController::class, 'download']);
    Route::delete('/files/{id}', [FileController::class, 'destroy']);
});
