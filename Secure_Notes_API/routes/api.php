<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/users', [UserController::class, 'index']);      // عرض الكل
    Route::get('/users/{id}', [UserController::class, 'show']);  // عرض واحد
    Route::put('/users/{id}', [UserController::class, 'update']); // تعديل (محمي)
    Route::delete('/users/{id}', [UserController::class, 'destroy']); // حذف (محمي)


    Route::get('/notes/search', [NoteController::class, 'search']);
    // النوتات لازم تسجيل دخول
    Route::apiResource('notes', NoteController::class);
});
