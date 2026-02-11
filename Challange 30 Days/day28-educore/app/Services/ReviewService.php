<?php

namespace App\Services;

use App\Models\User;
use App\Models\Course;
use App\Models\Review;
use Illuminate\Support\Facades\DB;
use Exception;

class ReviewService
{
    /**
     * Create a new review for a course.
     */
    public function createReview(User $user, $courseId, array $data)
    {
        $course = Course::findOrFail($courseId);

        // 1. Validation: Check if the user is enrolled in the course
        if (! $user->enrolledCourses()->where('course_id', $courseId)->exists()) {
            throw new Exception("You must enroll in the course to review it.");
        }

        // 2. Validation: Check if the user has already reviewed the course
        if ($course->reviews()->where('user_id', $user->id)->exists()) {
            throw new Exception("You have already reviewed this course.");
        }

        return DB::transaction(function () use ($user, $course, $data) {
            // Create the review
            $review = Review::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'rating' => $data['rating'],
                'comment' => $data['comment'] ?? null,
            ]);

            // Update course average rating and reviews count
            $avg = $course->reviews()->avg('rating');
            $count = $course->reviews()->count();

            $course->update([
                'average_rating' => $avg,
                'reviews_count' => $count
            ]);

            return $review;
        });
    }
}
