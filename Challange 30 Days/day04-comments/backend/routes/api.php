<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\VideoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('posts', PostController::class);
Route::apiResource('videos', VideoController::class);
Route::apiResource('comments', CommentController::class);
