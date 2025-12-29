<?php

use App\Http\Controllers\PropertyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Search properties
Route::get('/properties/search', [PropertyController::class, 'search']);

// CRUD operations
Route::apiResource('properties', PropertyController::class);
