<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        return Post::with('category')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id'
        ]);

        $post = Post::create($data);

        return response()->json([
            'message' => 'Post created',
            'post' => $post
        ]);
    }

    public function show($id)
    {
        return Post::with('category')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id'
        ]);

        $post->update($data);

        return response()->json([
            'message' => 'Post updated',
            'post' => $post
        ]);
    }

    public function destroy($id)
    {
        Post::findOrFail($id)->delete();
        return response()->json([
            'message' => 'Post deleted'
        ]);
    }
}
