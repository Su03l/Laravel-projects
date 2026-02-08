<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\RoomServiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/verify-account', [AuthController::class, 'verifyAccount']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/login/verify', [AuthController::class, 'loginVerify']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

//  Public General Data & Search
Route::get('/packages', [HomeController::class, 'packages']);
Route::get('/amenities', [HomeController::class, 'amenities']);
Route::get('/rooms/search', [BookingController::class, 'search']);
Route::get('/rooms/{id}', [HomeController::class, 'roomDetails']);
Route::get('/rooms/{id}/reviews', [ReviewController::class, 'index']);

// Protected Routes (يحتاج توكن)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // لنتأكد من هوية المستخدم الحالي
    Route::get('/auth/me', function (Request $request) {
        return $request->user();
    });

    //  User Profile & Settings
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);           // عرض
        Route::post('/update', [ProfileController::class, 'update']);  // تعديل
        Route::post('/password', [ProfileController::class, 'changePassword']); // باسورد
        Route::post('/2fa', [ProfileController::class, 'toggleTwoFactor']);     // زر الأمان
    });

    // Bookings
    Route::post('/bookings', [BookingController::class, 'store']);      // احجز
    Route::get('/my-bookings', [BookingController::class, 'index']);    // حجوزاتي
    Route::post('/bookings/{id}/cancel', [BookingController::class, 'cancel']); // إلغاء

    //  Room Services
    Route::get('/services/menu', [RoomServiceController::class, 'index']); // المنيو
    Route::post('/services/order', [RoomServiceController::class, 'store']); // اطلب
    Route::get('/bookings/{id}/orders', [RoomServiceController::class, 'myOrders']); // فاتورتي

    //  Favorites
    Route::post('/favorites/toggle', [FavoriteController::class, 'toggle']);
    Route::get('/favorites', [FavoriteController::class, 'index']);

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);
});

// Admin Dashboard & Management
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    // Dashboard
    Route::get('/dashboard', [AdminController::class, 'dashboard']);

    // Manage Bookings
    Route::get('/bookings', [AdminController::class, 'bookings']);
    Route::put('/bookings/{id}/status', [AdminController::class, 'updateBookingStatus']);

    // Manage Rooms
    Route::put('/rooms/{id}/status', [AdminController::class, 'updateRoomStatus']);

});
