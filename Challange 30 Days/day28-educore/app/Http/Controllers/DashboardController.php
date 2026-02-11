<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Progress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // جلب الدورات مع حساب التقدم
        $enrollments = Enrollment::where('user_id', $user->id)
            ->with(['course.teacher', 'course.lessons'])
            ->latest('enrolled_at')
            ->get();

        $enrolledCourses = $enrollments->take(3)->map(function ($enrollment) use ($user) {
            $course = $enrollment->course;
            if (!$course) return null;

            $totalLessons = $course->lessons->count();
            $completedLessons = Progress::where('user_id', $user->id)
                ->whereIn('lesson_id', $course->lessons->pluck('id'))
                ->where('is_completed', true)
                ->count();

            $progress = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0;

            return [
                'id' => $course->id,
                'title' => $course->title,
                'instructor' => $course->teacher ? $course->teacher->name : 'مدرب',
                'progress' => $progress,
                'image' => $course->thumbnail_url ?? 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
                'lastLesson' => 'مواصلة التعلم'
            ];
        })->filter();

        // حساب إجمالي النقاط من الدورات المكتملة 100%
        $totalPoints = $enrollments->filter(function ($enrollment) use ($user) {
            $totalLessons = $enrollment->course->lessons->count();
            $completedLessons = Progress::where('user_id', $user->id)
                ->whereIn('lesson_id', $enrollment->course->lessons->pluck('id'))
                ->where('is_completed', true)
                ->count();
            return $totalLessons > 0 && $completedLessons === $totalLessons;
        })->sum(function ($enrollment) {
            return $enrollment->course->points ?? 100;
        });

        return Inertia::render('Dashboard', [
            'enrolledCourses' => $enrolledCourses,
            'stats' => [
                'activeCourses' => $enrollments->count(),
                'completedCourses' => $enrollments->whereNotNull('completed_at')->count(),
                'certificates' => $enrollments->whereNotNull('completed_at')->count(),
                'points' => $totalPoints
            ]
        ]);
    }

    public function myLearning(Request $request)
    {
        $user = $request->user();

        $enrolledCourses = Enrollment::where('user_id', $user->id)
            ->with(['course.teacher', 'course.lessons'])
            ->latest('enrolled_at')
            ->get()
            ->map(function ($enrollment) use ($user) {
                $course = $enrollment->course;
                if (!$course) return null;

                $totalLessons = $course->lessons->count();
                $completedLessons = Progress::where('user_id', $user->id)
                    ->whereIn('lesson_id', $course->lessons->pluck('id'))
                    ->where('is_completed', true)
                    ->count();

                $progress = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0;

                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'instructor' => $course->teacher ? $course->teacher->name : 'مدرب',
                    'progress' => $progress,
                    'image' => $course->thumbnail_url ?? 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
                    'lastAccessed' => $enrollment->enrolled_at ? $enrollment->enrolled_at->diffForHumans() : 'غير متوفر'
                ];
            })->filter();

        return Inertia::render('Dashboard/MyLearning', [
            'courses' => $enrolledCourses
        ]);
    }
}
