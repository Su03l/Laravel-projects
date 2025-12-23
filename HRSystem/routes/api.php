<?php

use App\Http\Controllers\DepartmentsController;
use App\Http\Controllers\EmployeesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::apiResource('departments', DepartmentsController::class);
Route::apiResource('employees', EmployeesController::class);
