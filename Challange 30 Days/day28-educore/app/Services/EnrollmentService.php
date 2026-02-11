<?php

namespace App\Services;

use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Support\Facades\DB;
use Exception;

class EnrollmentService
{
    /**
     * Execute the enrollment process (course purchase).
     */
    public function enroll(User $user, Course $course): Enrollment
    {
        // 1. Validation: Check if the user is already enrolled
        if ($user->enrolledCourses()->where('course_id', $course->id)->exists()) {
            throw new Exception("You are already enrolled in this course.");
        }

        // 2. Payment processing (Mocking Payment Gateway)
        // This is where you would integrate with Stripe/Paddle.
        $paidAmount = $course->price;

        // 3. Execution within a transaction to ensure data integrity
        return DB::transaction(function () use ($user, $course, $paidAmount) {

            // Create enrollment record
            $enrollment = Enrollment::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'paid_amount' => $paidAmount,
                'enrolled_at' => now(),
            ]);

            return $enrollment;
        });
    }
}
