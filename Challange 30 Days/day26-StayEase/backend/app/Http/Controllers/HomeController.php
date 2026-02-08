<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Amenity;
use App\Models\Room;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    // 1. List Packages (For Booking Dropdown)
    public function packages(): JsonResponse
    {
        return response()->json(Package::all());
    }

    // 2. List Amenities (For Search Filters)
    public function amenities(): JsonResponse
    {
        return response()->json(Amenity::all());
    }

    // 3. Single Room Details
    public function roomDetails($id): JsonResponse
    {
        $room = Room::with(['images', 'amenities', 'reviews.user'])
            ->findOrFail($id);

        return response()->json($room);
    }
}
