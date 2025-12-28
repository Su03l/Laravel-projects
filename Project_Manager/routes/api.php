<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\AttachmentController;

Route::apiResource('projects', ProjectController::class);
