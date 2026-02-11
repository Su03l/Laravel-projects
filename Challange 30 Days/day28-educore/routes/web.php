<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\InstructorDashboardController;
use App\Http\Controllers\Api\EnrollmentController as ApiEnrollmentController;
use App\Http\Controllers\Api\ProgressController as ApiProgressController;

// Public Routes
Route::get('/', function () {
    return Inertia::render('Marketplace/Home');
})->name('home');

Route::get('/browse', [CourseController::class, 'index'])->name('courses.index');
Route::get('/courses/{course}', [CourseController::class, 'show'])->name('courses.show');

// Auth Routes
Route::middleware(['guest'])->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

// Protected Routes
Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/my-learning', [DashboardController::class, 'myLearning'])->name('my-learning');

    // Classroom Routes
    Route::get('/learn/{course}/{lesson?}', [ClassroomController::class, 'show'])->name('learn');

    // Certificate Routes
    Route::get('/certificates', [CertificateController::class, 'index'])->name('certificates.index');
    Route::get('/certificates/{enrollment}/view-html', [CertificateController::class, 'viewHTML'])->name('certificates.view-html');
    Route::get('/certificates/{enrollment}/download', [CertificateController::class, 'download'])->name('certificates.download');

    // Instructor Routes
    Route::middleware(['auth'])->prefix('instructor')->group(function () {
        Route::get('/', [InstructorDashboardController::class, 'index'])->name('instructor.dashboard');

        Route::get('/courses/create', function () {
            return Inertia::render('Instructor/CreateCourse');
        })->name('instructor.courses.create');

        Route::post('/courses', [InstructorDashboardController::class, 'store'])->name('instructor.courses.store');

        // Course Builder Routes
        Route::get('/courses/{course}/builder', [InstructorDashboardController::class, 'builder'])->name('instructor.courses.builder');
        Route::post('/courses/{course}/publish', [InstructorDashboardController::class, 'publish'])->name('instructor.courses.publish');

        // Chapters
        Route::post('/courses/{course}/chapters', [InstructorDashboardController::class, 'storeChapter'])->name('instructor.chapters.store');
        Route::patch('/chapters/{chapter}', [InstructorDashboardController::class, 'updateChapter'])->name('instructor.chapters.update');
        Route::delete('/chapters/{chapter}', [InstructorDashboardController::class, 'destroyChapter'])->name('instructor.chapters.destroy');

        // Lessons
        Route::post('/chapters/{chapter}/lessons', [InstructorDashboardController::class, 'storeLesson'])->name('instructor.lessons.store');
        Route::patch('/lessons/{lesson}', [InstructorDashboardController::class, 'updateLesson'])->name('instructor.lessons.update');
        Route::delete('/lessons/{lesson}', [InstructorDashboardController::class, 'destroyLesson'])->name('instructor.lessons.destroy');
    });

    // Profile Routes
    Route::get('/profile', function () {
        return Inertia::render('Profile/Edit');
    })->name('profile');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password.update');

    // Action Routes
    Route::post('/courses/{course}/enroll', [ApiEnrollmentController::class, 'store'])->name('courses.enroll');
    Route::post('/lessons/{lesson}/complete', [ApiProgressController::class, 'update'])->name('lessons.complete');
});
