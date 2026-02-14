<?php

use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\PasswordController;
use App\Http\Controllers\Api\Auth\ProfileController;
use App\Http\Controllers\Api\Fleet\DriverController;
use App\Http\Controllers\Api\Fleet\VehicleController;
use App\Http\Controllers\Api\General\NotificationController;
use App\Http\Controllers\Api\Operations\LocationController;
use App\Http\Controllers\Api\Operations\ShipmentController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {

    // Common Routes (All Users)
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/password', [PasswordController::class, 'update']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/read', [NotificationController::class, 'markAsRead']);

    //  Admin Area (Admins & Dispatchers Only)
    Route::middleware(['admin'])->group(function () {

        // Dashboard
        Route::get('/dashboard/stats', [DashboardController::class, 'index']);

        // Fleet Management (CRUD)
        Route::apiResource('vehicles', VehicleController::class);
        Route::apiResource('drivers', DriverController::class);

        // Shipments Management
        Route::post('/shipments', [ShipmentController::class, 'store']);
        Route::post('/shipments/{shipment}/assign', [ShipmentController::class, 'assignDriver']);

        // Employee Management
        Route::post('/employees', [AuthController::class, 'registerEmployee']);
    });

    //  Driver Area (Drivers Only)
    Route::get('/shipments', [ShipmentController::class, 'index']);
    Route::get('/shipments/{shipment}', [ShipmentController::class, 'show']);

    // Driver Actions
    Route::post('/shipments/{shipment}/status', [ShipmentController::class, 'updateStatus']);
    Route::post('/shipments/{shipment}/delivery', [ShipmentController::class, 'completeDelivery']); // POD
    Route::post('/driver/location', [LocationController::class, 'update']);
});
