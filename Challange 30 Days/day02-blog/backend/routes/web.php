<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::apiResource('categories', CategoryController::class);

Route::apiResource('posts', PostController::class);
