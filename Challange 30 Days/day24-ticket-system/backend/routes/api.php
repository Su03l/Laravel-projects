<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Comment\CommentController;
use App\Http\Controllers\Profile\AdminUserController;
use App\Http\Controllers\Profile\ProfileController;
use App\Http\Controllers\Ticket\AgentTicketController;
use App\Http\Controllers\Ticket\TicketController;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    // --- Auth & Profile ---
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [ProfileController::class, 'me']);
    Route::post('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/password', [ProfileController::class, 'changePassword']);
    Route::get('/users/{id}', [ProfileController::class, 'show']); // للموظف يشوف العميل

    // --- Admin User Management (للأدمن فقط) ---
    Route::middleware('role:Admin')->group(function () {
        // عرض المستخدمين
        Route::get('/admin/users', [AdminUserController::class, 'index']);

        // 🆕 إنشاء موظف جديد (هذا هو الرابط الجديد)
        Route::post('/admin/agents', [AdminUserController::class, 'storeAgent']);

        // حظر/تفعيل مستخدم
        Route::post('/admin/users/{id}/toggle-status', [AdminUserController::class, 'toggleStatus']);
    });

    // --- Tickets (General) ---
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::get('/tickets/{uuid}', [TicketController::class, 'show']);

    // --- Agent Actions (Only Admin/Agent) ---
    Route::middleware('role:Admin|Agent')->group(function () {
        Route::post('/tickets/{uuid}/assign', [AgentTicketController::class, 'assignSelf']);
        Route::put('/tickets/{uuid}/status', [AgentTicketController::class, 'updateStatus']);
        Route::post('/tickets/{uuid}/typing', [AgentTicketController::class, 'broadcastTyping']); // 🔴 Typing Event
    });

    // --- Comments ---
    Route::get('/tickets/{uuid}/comments', [CommentController::class, 'index']);
    Route::post('/tickets/{uuid}/comments', [CommentController::class, 'store']);

});
