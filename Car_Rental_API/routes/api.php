<?php

use App\Http\Controllers\CarController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\RentalController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// 1. السيارات
Route::apiResource('cars', CarController::class);

// 2. العملاء
Route::apiResource('customers', CustomerController::class);

// 3. التأجير (سبق وسويناه)
Route::apiResource('rentals', RentalController::class);
Route::post('/rentals/{rental}/return', [RentalController::class, 'returnCar']);
