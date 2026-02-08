<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\Booking;
use App\Actions\SearchRoomsAction;
use App\Actions\CreateBookingAction;
use App\DTOs\CreateBookingDTO;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class BookingController extends Controller
{
    // 1. Advanced Search (Public)
    public function search(Request $request, SearchRoomsAction $action): JsonResponse
    {
        $filters = $request->validate([
            'check_in' => 'nullable|date|after:today',
            'check_out' => 'nullable|date|after:check_in',
            'type' => 'nullable|string',
            'view' => 'nullable|string',
            'capacity' => 'nullable|integer|min:1',
        ]);

        $rooms = $action->execute($filters);

        return response()->json([
            'count' => $rooms->count(),
            'rooms' => $rooms
        ]);
    }

    // 2. Create Booking (Protected)
    public function store(Request $request, CreateBookingAction $action): JsonResponse
    {
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'package_id' => 'required|exists:packages,id',
            'check_in' => 'required|date|after:today',
            'check_out' => 'required|date|after:check_in',
            'notes' => 'nullable|string',
            'coupon_code' => 'nullable|exists:coupons,code',
        ]);

        $dto = CreateBookingDTO::fromRequest($request);

        $booking = $action->execute($request->user(), $dto);

        return response()->json([
            'message' => 'تم الحجز بنجاح!',
            'booking' => $booking->load('room', 'package')
        ], 201);
    }

    // 3. My Bookings
    public function index(Request $request): JsonResponse
    {
        $bookings = $request->user()->bookings()
            ->with(['room', 'package'])
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    // 4. Cancel Booking (48h Rule)
    public function cancel(Request $request, $id): JsonResponse
    {
        $booking = $request->user()->bookings()->findOrFail($id);

        if ($booking->status === \App\Enums\BookingStatus::CANCELLED) {
            return response()->json(['message' => 'الحجز ملغي بالفعل.'], 400);
        }

        $checkInDate = Carbon::parse($booking->check_in);
        $hoursDifference = now()->diffInHours($checkInDate, false);

        if ($hoursDifference < 48) {
             return response()->json([
                 'message' => 'عذراً، لا يمكن إلغاء الحجز قبل أقل من 48 ساعة من موعد الوصول.'
             ], 400);
        }

        $booking->update(['status' => \App\Enums\BookingStatus::CANCELLED]);

        return response()->json(['message' => 'تم إلغاء الحجز بنجاح.']);
    }
}
