<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Transaction\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/admin/add-employee', [AdminController::class, 'createEmployee']);

    Route::get('/transactions', [TransactionController::class, 'index']); // عرض الجدول
    Route::post('/transactions', [TransactionController::class, 'store']); // إضافة فاتورة
    Route::get('/stats', [TransactionController::class, 'stats']);

    // --- التقارير ---
    Route::get('/report/excel', [TransactionController::class, 'exportExcel']);
    Route::get('/report/invoice/{id}', [TransactionController::class, 'downloadInvoice']);

});
