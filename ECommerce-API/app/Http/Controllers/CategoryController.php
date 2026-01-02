<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function index()
    {
        return response()->json(Category::all());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:categories,name']);

        $category = Category::create($request->all());

        return response()->json([
            'message' => 'تم إنشاء القسم بنجاح',
            'data' => $category
        ], 201);
    }

    public function show($id)
    {
        return response()->json(Category::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'required|string|unique:categories,name,' . $id
        ]);

        $category->update($request->all());

        return response()->json([
            'message' => 'تم التحديث ',
            'data' => $category
        ]);
    }

    public function destroy(string $id)
    {
        Category::destroy($id);
        return response()->json([
            'message' => 'تم حذف القسم ️'
        ]);
    }
}
