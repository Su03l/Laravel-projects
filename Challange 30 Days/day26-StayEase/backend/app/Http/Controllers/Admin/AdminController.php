<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Room;
use App\Services\DashboardService;
use App\Enums\BookingStatus;
use App\Enums\RoomStatus;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    // 1. Dashboard Stats
    public function dashboard(DashboardService $service): JsonResponse
    {
        return response()->json($service->getStats());
    }

    // 2. View All Bookings (with filters)
    public function bookings(Request $request): JsonResponse
    {
        $query = Booking::with(['user', 'room', 'package'])->latest();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('room_number')) {
            $query->whereRelation('room', 'room_number', $request->room_number);
        }

        return response()->json($query->paginate(20));
    }

    // 3. Update Booking Status (Admin Override)
    public function updateBookingStatus(Request $request, $id): JsonResponse
    {
        $request->validate(['status' => 'required|string']);

        $booking = Booking::findOrFail($id);

        $booking->update(['status' => $request->status]);

        return response()->json(['message' => 'تم تعديل حالة الحجز بنجاح.', 'booking' => $booking]);
    }

    // 4. Update Room Status (Maintenance/Cleaning)
    public function updateRoomStatus(Request $request, $id): JsonResponse
    {
        $request->validate(['status' => 'required|string']);

        $room = Room::findOrFail($id);
        $room->update(['status' => $request->status]);

        return response()->json(['message' => "تم تغيير حالة الغرفة {$room->room_number} إلى {$request->status}"]);
    }
}
