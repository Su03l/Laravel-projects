<?php

namespace App\Http\Controllers\Follow;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['user_id' => 'required|exists:users,id']);

        $userToFollow = $request->user_id;

        if ($userToFollow == Auth::id()) {
            return response()->json([
                'message' => 'You cannot follow yourself'
            ], 400);
        }

        $request->user()->followings()->syncWithoutDetaching([$userToFollow]);
        return response()->json([
            'message' => 'Followed successfully'
        ]);
    }

    public function destroy($id)
    {
        Auth::user()->followings()->detach($id);

        return response()->json([
            'message' => 'Unfollowed successfully'
        ]);
    }
}
