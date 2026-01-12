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
            'title' => 'required|string|min:2|max:255',
            'content' => 'required|string|min:10',
            'category_id' => 'required|exists:categories,id',
        ]);

        $post = Post::create($data);
        return response()->json([
            'message' => 'Post created successfully',
            'post' => $post->load('category'),
        ], 201);
    }

    public function show($id)
    {
        return Post::with('category')->findOrFail($id);
    }

    public function update($id, Request $request)
    {
        $post = Post::findOrFail($id);

        $data = $request->validate([
            'title' => 'required|string|min:2|max:255',
            'content' => 'required|string|min:10',
            'category_id' => 'required|exists:categories,id',
        ]);

        $post->update($data);

        return response()->json([
            'message' => 'Post updated successfully',
            'post' => $post->load('category'),
        ]);
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();
        return response()->json([
            'message' => 'Post deleted successfully',
        ]);
    }
}
