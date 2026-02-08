<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Booking;
use App\Actions\OrderRoomServiceAction;
use Illuminate\Http\JsonResponse;

class RoomServiceController extends Controller
{
    // 1. Menu
    public function index(): JsonResponse
    {
        return response()->json(Service::all()->groupBy('category'));
    }

    // 2. Order Service
    public function store(Request $request, OrderRoomServiceAction $action): JsonResponse
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'service_id' => 'required|exists:services,id',
            'quantity' => 'required|integer|min:1|max:10'
        ]);

        $booking = Booking::where('user_id', $request->user()->id)
            ->findOrFail($request->booking_id);

        $action->execute($booking, $request->service_id, $request->quantity);

        return response()->json(['message' => 'تم استلام طلبك، جاري التحضير!']);
    }

    // 3. My Orders
    public function myOrders(Request $request, $bookingId): JsonResponse
    {
        $booking = Booking::where('user_id', $request->user()->id)
            ->with('services')
            ->findOrFail($bookingId);

        return response()->json($booking->services);
    }
}
