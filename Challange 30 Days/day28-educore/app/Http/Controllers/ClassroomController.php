<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassroomController extends Controller
{
    public function show(Request $request, $courseId, $lessonId = null)
    {
        $user = $request->user();

        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        if (!$enrollment) {
            return redirect()->route('courses.show', $courseId)
                ->with('error', 'يجب عليك الاشتراك في الدورة أولاً للوصول إلى المحتوى.');
        }

        $course = Course::with(['chapters.lessons'])->findOrFail($courseId);
        $allLessons = $course->lessons;

        if (!$lessonId) {
            $currentLesson = $allLessons->first();
        } else {
            $currentLesson = Lesson::findOrFail($lessonId);
        }

        // إيجاد الدرس السابق والتالي
        $currentIndex = $allLessons->search(fn($lesson) => $lesson->id === $currentLesson->id);
        $prevLesson = $currentIndex > 0 ? $allLessons[$currentIndex - 1] : null;
        $nextLesson = $currentIndex < $allLessons->count() - 1 ? $allLessons[$currentIndex + 1] : null;

        $completedLessonIds = $user->progress()
            ->whereIn('lesson_id', $allLessons->pluck('id'))
            ->where('is_completed', true)
            ->pluck('lesson_id')
            ->toArray();

        return Inertia::render('Classroom/Learn', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'chapters' => $course->chapters->map(function ($chapter) use ($currentLesson, $completedLessonIds) {
                    return [
                        'id' => $chapter->id,
                        'title' => $chapter->title,
                        'lessons' => $chapter->lessons->map(function ($lesson) use ($currentLesson, $completedLessonIds) {
                            return [
                                'id' => $lesson->id,
                                'title' => $lesson->title,
                                'duration' => $lesson->duration_formatted ?? '05:00',
                                'completed' => in_array($lesson->id, $completedLessonIds),
                                'active' => $currentLesson && $lesson->id === $currentLesson->id,
                            ];
                        })
                    ];
                })
            ],
            'currentLesson' => $currentLesson,
            'navigation' => [
                'prev_id' => $prevLesson?->id,
                'next_id' => $nextLesson?->id,
            ],
            'progress' => [
                'percentage' => count($completedLessonIds) > 0 && $allLessons->count() > 0
                    ? round((count($completedLessonIds) / $allLessons->count()) * 100)
                    : 0
            ]
        ]);
    }
}
