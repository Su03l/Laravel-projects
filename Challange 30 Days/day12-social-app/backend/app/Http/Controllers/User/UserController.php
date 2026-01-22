<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\Tweet\TweetResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->loadCount(['followers', 'followings', 'tweets']);
        $tweets = $user->tweets()->latest()->take(10)->get();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
            'followers_count' => $user->followers_count,
            'following_count' => $user->followings_count,
            'tweets_count' => $user->tweets_count,
            'tweets' => $tweets,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'username' => ['sometimes', 'string', 'alpha_dash', Rule::unique('users')->ignore($user->id)],
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed'
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect'
            ], 400);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return response()->json([
            'message' => 'Password changed successfully'
        ]);
    }

    public function getUserByUsername($username)
    {
        $user = User::where('username', $username)
            ->withCount(['followers', 'followings', 'tweets'])
            ->firstOrFail();

        $tweets = $user->tweets()->latest()->paginate(10);

        $currentUserId = Auth::guard('sanctum')->id();
        $isFollowing = false;

        if ($currentUserId) {
            $isFollowing = $user->followers()->where('follower_id', $currentUserId)->exists();
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => '@' . $user->username,
                'joined_at' => $user->created_at->format('M Y'),
                'stats' => [
                    'tweets_count' => $user->tweets_count,
                    'followers_count' => $user->followers_count,
                    'following_count' => $user->followings_count,
                ],
                'is_following' => $isFollowing,
                'is_me' => $currentUserId === $user->id,
            ],
            'tweets' => TweetResource::collection($tweets),
        ]);
    }

    public function getSuggestedUsers(Request $request)
    {
        $currentUserId = Auth::guard('sanctum')->id();

        $query = User::withCount('tweets')
            ->inRandomOrder()
            ->take(5);

        // Exclude current user and users they already follow
        if ($currentUserId) {
            $followingIds = User::find($currentUserId)
                ->followings()
                ->pluck('users.id')
                ->toArray();

            $query->whereNotIn('id', array_merge([$currentUserId], $followingIds));
        }

        $users = $query->get();

        return response()->json([
            'users' => $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'tweets_count' => $user->tweets_count,
                ];
            }),
        ]);
    }
}
