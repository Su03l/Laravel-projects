<?php

use App\Http\Controllers\WeatherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/weather/top', [WeatherController::class, 'topCities']);

Route::get('/weather/{city}', [WeatherController::class, 'show']);
