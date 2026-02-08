<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;
use Illuminate\Http\JsonResponse;

class FavoriteController extends Controller
{
    // Toggle (Like / Unlike)
    public function toggle(Request $request): JsonResponse
    {
        $request->validate(['room_id' => 'required|exists:rooms,id']);

        $user = $request->user();
        $roomId = $request->room_id;

        $user->favorites()->toggle($roomId);

        return response()->json(['message' => 'تم تحديث المفضلة']);
    }

    // List Favorites
    public function index(Request $request): JsonResponse
    {
        return response()->json($request->user()->favorites()->with('images')->get());
    }
}
