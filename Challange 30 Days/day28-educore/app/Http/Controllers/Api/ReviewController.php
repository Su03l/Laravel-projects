<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReviewService;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(protected ReviewService $reviewService) {}

    /**
     * Store a new review for a course.
     */
    public function store(Request $request, $courseId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        try {
            $this->reviewService->createReview($request->user(), $courseId, $request->all());
            return response()->json([
                'message' => 'Review submitted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 403);
        }
    }

    /**
     * Display a listing of reviews for a specific course.
     */
    public function index($courseId)
    {
        $reviews = Review::with('user')
            ->where('course_id', $courseId)
            ->latest()
            ->paginate(5);

        return response()->json($reviews);
    }
}
