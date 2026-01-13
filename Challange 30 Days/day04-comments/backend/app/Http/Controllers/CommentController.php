<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Video;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index()
    {
        $comments = Comment::with('commentable')->get();
        return response()->json($comments);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'body' => 'required|string',
            'type' => 'required|in:post,video',
            'id' => 'required|integer',
        ]);

        $modelClass = match ($data['type']) {
            'post' => Post::class,
            'video' => Video::class,
        };

        $target = $modelClass::findOrFail($data['id']);

        $comment = $target->comments()->create([
            'body' => $data['body']
        ]);

        return response()->json([
            'message' => 'Comment added successfully',
            'comment' => $comment
        ], 201);
    }

    public function show($id)
    {
        $comment = Comment::with('commentable')->findOrFail($id);
        return response()->json($comment);
    }

    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        $data = $request->validate([
            'body' => 'required|string'
        ]);

        $comment->update($data);

        return response()->json([
            'message' => 'Comment updated successfully',
            'comment' => $comment
        ]);
    }

    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully'
        ]);
    }
}
