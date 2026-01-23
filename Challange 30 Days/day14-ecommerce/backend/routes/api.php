<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Ecommerce\ProductController;
use App\Http\Controllers\Ecommerce\CategoryController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\User\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Shop Browsing (عرض المنتجات والأقسام لا يحتاج تسجيل دخول)
Route::get('/categories', [CategoryController::class, 'index']);      // كل الأقسام
Route::get('/categories/{id}', [CategoryController::class, 'show']);  // قسم محدد ومنتجاته

Route::get('/products', [ProductController::class, 'index']);         // كل المنتجات
Route::get('/products/{id}', [ProductController::class, 'show']);     // تفاصيل منتج



Route::middleware('auth:sanctum')->group(function () {

    //  Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    //  User Profile (إدارة الحساب)
    Route::get('/user/profile', [UserController::class, 'show']);
    Route::put('/user/profile', [UserController::class, 'update']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);

    //  Order System (نظام الطلبات)
    Route::post('/checkout', [OrderController::class, 'store']);          // إنشاء طلب جديد
    Route::get('/orders', [OrderController::class, 'index']);             // عرض طلباتي الخاصة
    Route::get('/orders/{id}', [OrderController::class, 'show']);         // تفاصيل طلب محدد
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']); // إلغاء طلب
});


// ==========================
// 👮‍♂️ 3. ADMIN ROUTES (للإدارة فقط)
// ==========================
// يتطلب تسجيل دخول + صلاحية أدمن (IsAdmin Middleware)

Route::middleware(['auth:sanctum', 'isAdmin'])->group(function () {

    // 📦 Manage Categories (إدارة الأقسام)
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // 🏷️ Manage Products (إدارة المنتجات)
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // 📊 Admin Dashboard (لوحة التحكم)
    Route::get('/admin/orders', [OrderController::class, 'getAllOrders']); // عرض كل طلبات المتجر

});
