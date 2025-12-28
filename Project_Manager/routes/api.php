<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\AttachmentController;

Route::apiResource('projects', ProjectController::class);

Route::apiResource('tasks', TaskController::class);

Route::post('/notes', [NoteController::class, 'store']);

Route::put('/notes/{note}', [NoteController::class, 'update']);

Route::delete('/notes/{note}', [NoteController::class, 'destroy']);

Route::post('/attachments', [AttachmentController::class, 'store']);

Route::delete('/attachments/{attachment}', [AttachmentController::class, 'destroy']);
