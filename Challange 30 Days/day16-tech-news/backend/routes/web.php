<?php

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $stats = [
        'users' => User::count(),
        'articles' => Article::count(),
        'categories' => Category::count(),
    ];

    $latestArticles = Article::with(['user', 'category'])
        ->latest()
        ->take(6)
        ->get();

    $categories = Category::withCount('articles')->get();

    return view('welcome', compact('stats', 'latestArticles', 'categories'));
});
