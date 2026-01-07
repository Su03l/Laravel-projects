<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Http\Requests\Supplier\StoreSupplierRequest;
use App\Http\Requests\Supplier\UpdateSupplierRequest;
use App\Http\Resources\Supplier\SupplierResource;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::withCount('products')->get();
        return SupplierResource::collection($suppliers);
    }

    public function store(StoreSupplierRequest $request)
    {
        $supplier = Supplier::create($request->validated());

        return response()->json([
            'message' => 'تم إضافة المورد بنجاح',
            'supplier' => new SupplierResource($supplier),
        ], 201);
    }

    public function show(Supplier $supplier)
    {
        return new SupplierResource($supplier->loadCount('products'));
    }

    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        $supplier->update($request->validated());

        return response()->json([
            'message' => 'تم تحديث بيانات المورد',
            'supplier' => new SupplierResource($supplier),
        ]);
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return response()->json([
            'message' => 'تم حذف المورد بنجاح',
        ]);
    }
}
