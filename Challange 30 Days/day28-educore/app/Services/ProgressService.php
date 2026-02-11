<?php

namespace App\Services;

use App\Models\User;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Progress;
use Illuminate\Support\Facades\DB;

class ProgressService
{
    /**
     * Mark a specific lesson as completed.
     */
    public function markAsCompleted(User $user, Lesson $lesson): array
    {
        // 1. Record achievement (using updateOrCreate to prevent duplicates)
        Progress::updateOrCreate(
            ['user_id' => $user->id, 'lesson_id' => $lesson->id],
            ['is_completed' => true]
        );

        // 2. Recalculate total course progress
        $course = $lesson->chapter->course;

        return $this->calculateCourseProgress($user, $course);
    }

    /**
     * Calculate progress percentage in a specific course.
     */
    public function calculateCourseProgress(User $user, Course $course): array
    {
        // Total number of lessons in the course
        $totalLessons = $course->lessons()->count();

        if ($totalLessons === 0) {
            return ['percentage' => 0, 'completed_lessons' => 0];
        }

        // Number of lessons completed by the student in this course
        $completedLessons = Progress::where('user_id' , $user->id)
            ->whereHas('lesson', function ($q) use ($course) {
                $q->whereHas('chapter', function ($q) use ($course) {
                    $q->where('course_id', $course->id);
                });
            })
            ->where('is_completed', true)
            ->count();

        // Percentage calculation
        $percentage = round(($completedLessons / $totalLessons) * 100);

        // 3. Update enrollment table if the course is completed
        if ($percentage == 100) {
            $enrollment = $user->enrolledCourses()->where('course_id', $course->id)->first();
            if ($enrollment && is_null($enrollment->pivot->completed_at)) {
                $user->enrolledCourses()->updateExistingPivot($course->id, [
                    'completed_at' => now()
                ]);
            }
        }

        return [
            'percentage' => $percentage,
            'completed_lessons' => $completedLessons,
            'total_lessons' => $totalLessons,
            'is_finished' => $percentage == 100
        ];
    }
}
