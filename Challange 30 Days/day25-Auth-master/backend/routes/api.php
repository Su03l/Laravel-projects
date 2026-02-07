<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\VerifyOTPEmailController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\Auth\ForgotPasswordController;

Route::prefix('auth')->group(function () {
    Route::middleware('throttle:5,1')->post('/register', [RegisterController::class, 'register']); // تسجيل حساب جديد (5 محاولات/دقيقة)
    Route::middleware('throttle:5,1')->post('/login', [LoginController::class, 'login']); // تسجيل الدخول (5 محاولات/دقيقة)
    Route::post('/login/verify', [LoginController::class, 'loginVerify']); // تأكيد الدخول (2FA)
    Route::post('/verify', [VerifyOTPEmailController::class, 'verify']); // التحقق من كود OTP (للتسجيل الجديد)
    Route::middleware('throttle:3,1')->post('/resend-otp', [VerifyOTPEmailController::class, 'resendOtp']); // إعادة إرسال الكود (3 محاولات/دقيقة)
    Route::middleware('throttle:3,1')->post('/forgot-password', [ForgotPasswordController::class, 'sendCode']); // طلب رمز استعادة كلمة المرور (3 محاولات/دقيقة)
    Route::post('/reset-password', [ForgotPasswordController::class, 'reset']); // تغيير كلمة المرور باستخدام الرمز
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [LoginController::class, 'logout']); // تسجيل الخروج

    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']); // عرض بيانات الملف الشخصي
        Route::post('/update', [ProfileController::class, 'update']); // تحديث البيانات الشخصية
        Route::post('/change-password', [ProfileController::class, 'changePassword']); // تغيير كلمة المرور
        Route::post('/2fa', [ProfileController::class, 'toggleTwoFactor']); // تفعيل/إيقاف المصادقة الثنائية
    });

    //  أضفنا middleware للتحقق من أن الرول هو admin
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/users', [AdminDashboardController::class, 'index']); // عرض قائمة المستخدمين
        Route::get('/stats', [AdminDashboardController::class, 'stats']); // إحصائيات لوحة التحكم
        Route::post('/users', [AdminDashboardController::class, 'storeUser']); // إضافة مستخدم جديد
        Route::post('/users/{user}/ban', [AdminDashboardController::class, 'banUser']); // حظر مستخدم
        Route::delete('/users/{user}/avatar', [AdminDashboardController::class, 'removeAvatar']); // حذف صورة مستخدم مخالفة
        Route::post('/users/{user}/role', [AdminDashboardController::class, 'changeRole']); // تغيير صلاحية المستخدم
        Route::delete('/users/{user}', [AdminDashboardController::class, 'destroy']); // حذف مستخدم نهائياً
    });
});
