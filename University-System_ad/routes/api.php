<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']); // طالب جديد
Route::post('/login', [AuthController::class, 'login']);       // دخول (طالب أو مرشد)


Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/profile', [UserController::class, 'show']);
    Route::put('/profile', [UserController::class, 'update']);
    Route::put('/profile/password', [UserController::class, 'changePassword']);

    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);

    Route::get('/my-schedule', [RegistrationController::class, 'index']);           // عرض جدولي
    Route::post('/register-course', [RegistrationController::class, 'store']);      // تسجيل مادة
    Route::delete('/drop-course/{id}', [RegistrationController::class, 'destroy']); // حذف مادة


    Route::middleware('role:advisor')->group(function () {

        Route::get('/users', [UserController::class, 'index']); // عرض قائمة الطلاب

        Route::post('/courses', [CourseController::class, 'store']);      // إضافة مادة
        Route::put('/courses/{id}', [CourseController::class, 'update']); // تعديل مادة (الجديد)
        Route::delete('/courses/{id}', [CourseController::class, 'destroy']); // حذف مادة

        Route::get('/sections', [SectionController::class, 'index']);      // عرض الكل (أو فلتر)  جديد
        Route::get('/sections/{id}', [SectionController::class, 'show']);  // عرض شعبة  جديد
        Route::post('/sections', [SectionController::class, 'store']);     // فتح شعبة
        Route::put('/sections/{id}', [SectionController::class, 'update']);// تحديث شعبة  جديد
        Route::delete('/sections/{id}', [SectionController::class, 'destroy']); // حذف
    });

});
