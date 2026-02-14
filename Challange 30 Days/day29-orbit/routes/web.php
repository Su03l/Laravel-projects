<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskColumnController;
use App\Http\Controllers\TaskCommentController;
use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\WorkspaceMemberController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing Page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('welcome');

Route::middleware(['auth'])->group(function () {

    // Dashboard (Workspaces)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/workspaces', [WorkspaceController::class, 'store'])->name('workspaces.store');
    Route::get('/workspaces/{workspace}', [WorkspaceController::class, 'show'])->name('workspaces.show');

    // Project Board 
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::put('/columns/{column}/move', [ProjectController::class, 'moveColumn'])->name('columns.move');

    // Tasks Operations 
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::put('/tasks/{task}/move', [TaskController::class, 'move'])->name('tasks.move');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
    Route::put('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update'); // نسينا هذا!

    // Comments 
    Route::post('/tasks/{task}/comments', [TaskCommentController::class, 'store'])->name('comments.store');

    // Column Operations
    Route::post('/columns', [TaskColumnController::class, 'store'])->name('columns.store');
    Route::delete('/columns/{column}', [TaskColumnController::class, 'destroy'])->name('columns.destroy');

    // Invites 
    Route::post('/workspaces/{workspace}/invite', [WorkspaceMemberController::class, 'invite'])->name('workspace.invite');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
