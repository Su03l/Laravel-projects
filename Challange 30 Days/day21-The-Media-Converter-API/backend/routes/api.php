<?php

use App\Http\Controllers\ToolController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/tools/time', [ToolController::class, 'humanTime']);
Route::get('/tools/qr', [ToolController::class, 'qrCode']);
Route::get('/tools/text', [ToolController::class, 'textFormat']);
Route::get('/tools/crypto', [ToolController::class, 'cryptoPrice']);
Route::get('/tools/uuid', [ToolController::class, 'generateUuid']);
Route::get('/tools/image', [ToolController::class, 'imageTest']);


