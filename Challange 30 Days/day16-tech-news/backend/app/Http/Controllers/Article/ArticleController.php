<?php

namespace App\Http\Controllers\Article;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::with(['user:id,name,avatar', 'category:id,name'])
            ->latest()
            ->paginate(10);

        return response()->json($articles);
    }

    public function show($id)
    {
        $article = Article::with(['user', 'category', 'comments.user'])
            ->find($id);

        if (!$article) {
            return response()->json([
                'message' => 'المقال غير موجود'
            ], 404);
        }

        return response()->json($article);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|string',
        ]);

        $article = $request->user()->articles()->create([
            'title' => $request->input('title'),
            'body' => $request->input('body'),
            'category_id' => $request->input('category_id'),
            'image' => $request->input('image'),
        ]);

        return response()->json([
            'message' => 'تم نشر المقال بنجاح',
            'article' => $article
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'message' => 'المقال غير موجود'
            ], 404);
        }

        if ($request->user()->id !== $article->user_id) {
            return response()->json(['message' => 'غير مصرح لك بتعديل هذا المقال'], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
            'category_id' => 'sometimes|exists:categories,id',
            'image' => 'nullable|string',
        ]);

        $article->update($request->all());

        return response()->json([
            'message' => 'تم تعديل المقال بنجاح',
            'article' => $article
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'message' => 'المقال غير موجود'
            ], 404);
        }

        if ($request->user()->id !== $article->user_id) {
            return response()->json([
                'message' => 'غير مصرح لك بحذف هذا المقال'
            ], 403);
        }

        $article->delete();

        return response()->json([
            'message' => 'تم حذف المقال بنجاح'
        ]);
    }
}
