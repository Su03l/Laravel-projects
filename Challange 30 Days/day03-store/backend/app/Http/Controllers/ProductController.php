<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('categories')->get();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id'
        ]);

        $product = Product::create([
            'name' => $data['name'],
            'price' => $data['price'],
            'stock' => $data['stock'],
        ]);

        $product->categories()->attach($data['categories']);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product->load('categories')
        ], 201);
    }

    public function show($id)
    {
        $product = Product::with('categories')->findOrFail($id);
        return response()->json($product);
    }

    // تحديث
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id'
        ]);

        $product->update([
            'name' => $data['name'],
            'price' => $data['price'],
            'stock' => $data['stock'],
        ]);

        $product->categories()->sync($data['categories']);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product->load('categories')
        ]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}
