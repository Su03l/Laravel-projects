<?php

use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $categories = Category::withCount('products')->get();
    $latestProducts = Product::with('category')->latest()->take(4)->get();
    $stats = [
        'products' => Product::count(),
        'categories' => Category::count(),
        'orders' => 0, // Assuming orders table might exist or will be added
    ];

    return view('welcome', compact('categories', 'latestProducts', 'stats'));
});
