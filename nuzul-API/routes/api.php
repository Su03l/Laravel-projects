<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Booking\BookingController;
use App\Http\Controllers\Api\Listing\ListingController;
use App\Http\Controllers\Api\User\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']); // إنشاء حساب جديد
Route::post('/auth/login', [AuthController::class, 'login']);       // تسجيل دخول

Route::get('/listings', [ListingController::class, 'index']);       // عرض الكل + بحث (بالاسم والتاريخ)
Route::get('/listings/{id}', [ListingController::class, 'show']);   // عرض تفاصيل شاليه واحد


Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/profile', [UserController::class, 'show']);   // عرض بياناتي
    Route::put('/profile', [UserController::class, 'update']); // تعديل بياناتي (صورة، جوال، نبذة)

    Route::post('/listings', [ListingController::class, 'store']);          // إضافة شاليه
    Route::put('/listings/{id}', [ListingController::class, 'update']);     // تعديل شاليه
    Route::delete('/listings/{id}', [ListingController::class, 'destroy']); // حذف شاليه

    Route::get('/bookings', [BookingController::class, 'index']);               // عرض حجوزاتي
    Route::post('/bookings', [BookingController::class, 'store']);              // إنشاء حجز جديد
    Route::put('/bookings/{id}', [BookingController::class, 'update']);         // تعديل التواريخ (قبل 48 ساعة)
    Route::post('/bookings/{id}/cancel', [BookingController::class, 'cancel']); // إلغاء الحجز (قبل 48 ساعة)

});
