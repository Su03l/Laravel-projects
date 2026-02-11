<?php

use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\InstructorController;
use App\Http\Controllers\Api\ReviewController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{slug}', [CourseController::class, 'show']);
Route::get('/courses/{id}/reviews', [ReviewController::class, 'index']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth Management
    Route::post('/logout', [AuthController::class, 'logout']);

    // Profile and Dashboard
    Route::get('/user', [ProfileController::class, 'me']);
    Route::put('/user', [ProfileController::class, 'update']);
    Route::get('/user/courses', [ProfileController::class, 'myCourses']);

    // Enrollment and Progress
    Route::post('/courses/{id}/enroll', [EnrollmentController::class, 'store']);
    Route::post('/lessons/{id}/complete', [ProgressController::class, 'update']);

    // Reviews
    Route::post('/courses/{id}/reviews', [ReviewController::class, 'store']);

    // Certificate
    Route::get('/courses/{id}/certificate', [CertificateController::class, 'download']);

    // Instructor Studio (Protected by instructor middleware)
    Route::prefix('teacher')->middleware('instructor')->group(function () {
        Route::post('/upload', [MediaController::class, 'upload']);
        Route::post('/courses', [InstructorController::class, 'storeCourse']);
        Route::post('/courses/{id}/chapters', [InstructorController::class, 'storeChapter']);
        Route::post('/chapters/{id}/lessons', [InstructorController::class, 'storeLesson']);
        Route::put('/courses/{id}/publish', [InstructorController::class, 'publish']);
        Route::get('/analytics', [InstructorController::class, 'analytics']);
    });
});
