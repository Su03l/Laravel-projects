<?php

use App\Http\Controllers\Link\LinkController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/{code}', [LinkController::class, 'handle']);
