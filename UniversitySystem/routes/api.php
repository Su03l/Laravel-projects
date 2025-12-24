<?php

use App\Http\Controllers\CoursesController;
use App\Http\Controllers\StudentsController;
use Illuminate\Support\Facades\Route;




Route::apiResource('students', StudentsController::class);
Route::apiResource('courses', CoursesController::class);

Route::post('/students/{student}/courses', [StudentsController::class, 'registerCourse']);
Route::delete('/students/{student}/courses', [StudentsController::class, 'cancelCourse']);
