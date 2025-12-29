<?php

use App\Http\Controllers\EmployeeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/employees/search', [EmployeeController::class, 'search']);

Route::get('/employees/export', [EmployeeController::class, 'export']);

Route::apiResource('employees', EmployeeController::class);
