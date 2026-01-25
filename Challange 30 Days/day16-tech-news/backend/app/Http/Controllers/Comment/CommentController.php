<?php

namespace App\Http\Controllers\Comment;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function store(Request $request, $article_id)
    {
        $request->validate([
            'content' => 'required|string|max:500'
        ]);

        $article = Article::findOrFail($article_id);

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'article_id' => $article->id,
            'content' => $request->input('content')
        ]);

        $comment->load('user:id,username');

        return response()->json([
            'message' => 'Comment added',
            'comment' => $comment
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Not your comment!'
            ], 403);
        }

        $request->validate([
            'content' => 'required|string|max:500'
        ]);

        $comment->update([
            'content' => $request->input('content')
        ]);

        return response()->json([
            'message' => 'Comment updated',
            'comment' => $comment
        ]);
    }

    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Not your comment!'
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted '
        ]);
    }
}
