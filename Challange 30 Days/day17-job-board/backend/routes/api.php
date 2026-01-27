<?php

use App\Http\Controllers\Application\ApplicationController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Job\JobController;
use App\Http\Controllers\Upload\UploadController;
use App\Http\Controllers\UserProfile\ChangePasswordController;
use App\Http\Controllers\UserProfile\UserController;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);
Route::get('/users/{name}', [UserController::class, 'getUserByName']);

Route::middleware('auth:sanctum')->group(function () {

    // Auth & Profile
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [UserController::class, 'show']);
    Route::put('/profile', [UserController::class, 'update']);
    Route::post('/change-password', [ChangePasswordController::class, 'update']);
    Route::post('/upload', [UploadController::class, 'upload']);

    // Jobs (Companies)
    Route::post('/jobs', [JobController::class, 'store']);
    Route::put('/jobs/{id}', [JobController::class, 'update']);
    Route::delete('/jobs/{id}', [JobController::class, 'destroy']);

    // Applications (Seekers)
    Route::post('/jobs/{id}/apply', [ApplicationController::class, 'store']); // التقديم
    Route::get('/my-applications', [ApplicationController::class, 'myApplications']); // طلباتي

    // Applications (Companies viewing Candidates)
    Route::get('/jobs/{id}/applications', [ApplicationController::class, 'getJobApplications']);
    Route::put('/applications/{id}', [ApplicationController::class, 'update']);

    Route::put('/applications/{id}/status', [ApplicationController::class, 'changeStatus']);

    Route::delete('/applications/{id}', [ApplicationController::class, 'destroy']);
});
