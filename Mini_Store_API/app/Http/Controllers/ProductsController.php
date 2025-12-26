<?php

namespace App\Http\Controllers;

use App\Models\products;
use App\Http\Requests\StoreproductsRequest;
use App\Http\Requests\UpdateproductsRequest;

class ProductsController extends Controller
{

    public function index()
    {
        $products = products::all();

        return response()->json($products);
    }

    public function store(StoreproductsRequest $request)
    {
        $product = products::create($request->validated());

        return response()->json([
            'message' => 'تم إضافة المنتج بنجاح',
            'product' => $product
        ], 201);
    }

    public function show(products $product)
    {
        return response()->json($product);
    }

    public function update(UpdateproductsRequest $request, products $product)
    {
        $product->update($request->validated());

        return response()->json([
            'message' => 'تم تحديث المنتج بنجاح',
            'product' => $product
        ]);
    }

    public function destroy(products $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'تم حذف المنتج بنجاح'
        ]);
    }
}
