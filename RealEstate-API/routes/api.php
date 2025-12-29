<?php

use App\Http\Controllers\PropertyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/properties/search', [PropertyController::class, 'search']);

Route::apiResource('properties', PropertyController::class);
