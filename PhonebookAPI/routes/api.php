<?php

use App\Http\Controllers\PhonenumberController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::apiResource('/phonenumbers', \App\Http\Controllers\PhonenumberController::class);

Route::get('/phonenumbers/search/{number}', [PhonenumberController::class, 'searchByNumber']);
