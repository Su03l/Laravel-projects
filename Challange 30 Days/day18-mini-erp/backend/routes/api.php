<?php

use App\Http\Controllers\Attendance\AttendanceController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Client\ClientController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Employee\EmployeeController;
use App\Http\Controllers\Invoice\InvoiceController;
use App\Http\Controllers\Leave\LeaveController;
use App\Http\Controllers\Project\ProjectController;
use App\Http\Controllers\Task\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth & Profile
    Route::get('/user', function (Request $request) {
        return $request->user()->load('employee.department');
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // HR Management
    Route::apiResource('employees', EmployeeController::class);
    // Route::apiResource('departments', DepartmentController::class); // يحتاج إنشاء Controller

    // CRM
    Route::apiResource('clients', ClientController::class);

    // Project Management
    Route::apiResource('projects', ProjectController::class);
    Route::get('/tasks', [TaskController::class, 'index']); // عرض المهام
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{task}/status', [TaskController::class, 'updateStatus']);

    // Finance (Invoices & Expenses)
    Route::get('/invoices', [InvoiceController::class, 'index']); // عرض كل الفواتير
    Route::get('/invoices/project/{id}', [InvoiceController::class, 'projectInvoices']);
    Route::post('/invoices', [InvoiceController::class, 'store']);
    Route::put('/invoices/{invoice}/paid', [InvoiceController::class, 'markAsPaid']);
    // Route::apiResource('expenses', ExpenseController::class); // يحتاج إنشاء Controller

    // Leaves Management
    Route::post('/leaves', [LeaveController::class, 'store']);
    Route::get('/my-leaves', [LeaveController::class, 'myLeaves']);
    Route::put('/leaves/{leave}/status', [LeaveController::class, 'updateStatus']);

    // Attendance
    Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn']);
    Route::post('/attendance/check-out', [AttendanceController::class, 'checkOut']);
    // Route::get('/attendance/report', [AttendanceController::class, 'report']); // تقرير الحضور للـ HR

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
});
