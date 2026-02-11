<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;

class CoursePolicy
{
    /**
     * Determine whether the user can view the course content.
     */
    public function view(User $user, Course $course): bool
    {
        // اسمح بالدخول إذا كان هو المدرس أو مشتركاً في الكورس
        return $user->id === $course->teacher_id ||
               $user->enrolledCourses()->where('course_id', $course->id)->exists();
    }
}
