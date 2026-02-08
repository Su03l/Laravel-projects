<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Booking;
use App\Enums\BookingStatus;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    // Add Review
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        $user = $request->user();

        // 1. Check: Does the booking belong to this user? Is it completed?
        $booking = Booking::where('id', $request->booking_id)
            ->where('user_id', $user->id)
            ->where('status', BookingStatus::COMPLETED)
            ->first();

        if (!$booking) {
            return response()->json(['message' => 'عذراً، لا يمكنك تقييم حجز لم يكتمل أو لا يخصك.'], 403);
        }

        // 2. Check: Already reviewed?
        if (Review::where('booking_id', $booking->id)->exists()) {
            return response()->json(['message' => 'لقد قمت بتقييم هذه الإقامة مسبقاً.'], 422);
        }

        // 3. Create Review
        $review = Review::create([
            'user_id' => $user->id,
            'room_id' => $booking->room_id,
            'booking_id' => $booking->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json(['message' => 'شكراً لتقييمك!', 'data' => $review]);
    }

    // List Reviews for a Room
    public function index($roomId): JsonResponse
    {
        $reviews = Review::where('room_id', $roomId)
            ->with('user:id,name,avatar')
            ->latest()
            ->paginate(10);

        return response()->json($reviews);
    }
}
