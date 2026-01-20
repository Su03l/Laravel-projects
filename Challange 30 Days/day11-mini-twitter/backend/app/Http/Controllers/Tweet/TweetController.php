<?php

namespace App\Http\Controllers\Tweet;

use App\Http\Controllers\Controller;
use App\Http\Resources\Tweet\TweetResource;
use App\Models\Tweet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TweetController extends Controller
{
    public function index()
    {
        $tweets = Tweet::with('user')->latest()->paginate(10);
        return TweetResource::collection($tweets);
    }

    public function myTweets(Request $request)
    {
        $tweets = $request->user()->tweets()->with('user')->latest()->paginate(20);
        return TweetResource::collection($tweets);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'content' => 'required|string|max:280',
        ]);

        $tweet = $request->user()->tweets()->create([
            'content' => $data['content']
        ]);

        return new TweetResource($tweet);
    }

    public function show($id)
    {
        $tweet = Tweet::with('user')->findOrFail($id);

        return new TweetResource($tweet);
    }

    public function update(Request $request, $id)
    {
        $tweet = Tweet::findOrFail($id);

        if ($tweet->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized. You cannot edit this tweet.'
            ], 403);
        }

        $data = $request->validate([
            'content' => 'required|string|max:280',
        ]);

        $tweet->update([
            'content' => $data['content']
        ]);

        return response()->json([
            'message' => 'Tweet updated successfully',
            'tweet' => $tweet
        ]);
    }

    public function destroy($id)
    {
        $tweet = Tweet::findOrFail($id);

        if ($tweet->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized. This is not your tweet.'
            ], 403);
        }

        $tweet->delete();

        return response()->json([
            'message' => 'Tweet deleted successfully'
        ]);
    }
}
