<?php

use App\Http\Controllers\OrdersController;
use App\Http\Controllers\ProductsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::apiResource('orders', OrdersController::class);
Route::apiResource('products', ProductsController::class);

