<?php

namespace App\Http\Controllers\Api\Booking;

use App\Http\Controllers\Controller;
use App\Http\Requests\Booking\StoreBookingRequest;
use App\Http\Resources\Booking\BookingResource;
use App\Models\Booking;
use App\Models\Listing;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $bookings = $request->user()->bookings()->with('listing')->latest()->get();

        return BookingResource::collection($bookings);
    }

    public function store(StoreBookingRequest $request)
    {
        $listing = Listing::findOrFail($request->listing_id);

        $exists = Booking::where('listing_id', $listing->id)
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($request) {
                $query->whereBetween('check_in', [$request->check_in, $request->check_out])
                    ->orWhereBetween('check_out', [$request->check_in, $request->check_out])
                    ->orWhere(function ($q) use ($request) {
                        $q->where('check_in', '<', $request->check_in)
                            ->where('check_out', '>', $request->check_out);
                    });
            })->exists();

        if ($exists) {
            return response()->json([
                'message' => 'عذراً، هذا الشاليه محجوز في التواريخ المختارة.'
            ], 422);
        }

        $checkIn = Carbon::parse($request->check_in);
        $checkOut = Carbon::parse($request->check_out);
        $days = $checkIn->diffInDays($checkOut);

        $totalPrice = $days * $listing->price_per_night;

        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'listing_id' => $listing->id,
            'check_in' => $request->check_in,
            'check_out' => $request->check_out,
            'total_price' => $totalPrice,
            'status' => 'confirmed'
        ]);

        return response()->json([
            'message' => 'تم الحجز بنجاح!',
            'data' => new BookingResource($booking->load('listing'))
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
        ]);

        $booking = Booking::findOrFail($id);

        if ($request->user()->id !== $booking->user_id) {
            return response()->json([
                'message' => 'غير مصرح لك'
            ], 403);
        }

        if (now()->addDays(2)->gte($booking->check_in)) {
            return response()->json([
                'message' => 'عذراً، لا يمكن تعديل الحجز لأنه متبقي أقل من 48 ساعة.'
            ], 400);
        }

        $exists = Booking::where('listing_id', $booking->listing_id)
            ->where('id', '!=', $booking->id)
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($request) {
                $query->whereBetween('check_in', [$request->check_in, $request->check_out])
                    ->orWhereBetween('check_out', [$request->check_in, $request->check_out])
                    ->orWhere(function ($q) use ($request) {
                        $q->where('check_in', '<', $request->check_in)
                            ->where('check_out', '>', $request->check_out);
                    });
            })->exists();

        if ($exists) {
            return response()->json([
                'message' => 'التواريخ الجديدة غير متاحة.'
            ], 422);
        }

        $checkIn = Carbon::parse($request->check_in);
        $checkOut = Carbon::parse($request->check_out);
        $days = $checkIn->diffInDays($checkOut);

        $newPrice = $days * $booking->listing->price_per_night;

        $booking->update([
            'check_in' => $request->check_in,
            'check_out' => $request->check_out,
            'total_price' => $newPrice,
        ]);

        return response()->json([
            'message' => 'تم تعديل تواريخ الحجز بنجاح',
            'data' => new BookingResource($booking)
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        if ($request->user()->id !== $booking->user_id) {
            return response()->json([
                'message' => 'غير مصرح لك بإلغاء هذا الحجز'
            ], 403);
        }

        if (now()->addDays(2)->gte($booking->check_in)) {
            return response()->json([
                'message' => 'عذراً، لا يمكن إلغاء الحجز لأنه متبقي أقل من 48 ساعة على موعد الدخول.'
            ], 400);
        }

        $booking->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'تم إلغاء الحجز بنجاح',
            'data' => new BookingResource($booking)
        ]);
    }
}
