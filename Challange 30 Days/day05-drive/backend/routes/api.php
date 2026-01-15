<?php

use App\Http\Controllers\FileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('files/trash', [FileController::class, 'trash']);
Route::post('files/{id}/restore', [FileController::class, 'restore']);

Route::apiResource('files', FileController::class);
