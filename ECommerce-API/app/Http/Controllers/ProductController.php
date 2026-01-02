<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{

    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $fields['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($fields);

        return response()->json([
            'message' => 'تم إضافة المنتج ',
            'data' => $product
        ], 201);
    }

    public function show($id)
    {
        return response()->json(Product::with('category')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $fields = $request->validate([
            'name' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'stock' => 'sometimes|integer',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $fields['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($fields);

        return response()->json([
            'message' => 'تم تحديث المنتج ',
            'data' => $product
        ]);
    }


    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'message' => 'تم حذف المنتج وملف الصورة ️'
        ]);
    }
}
