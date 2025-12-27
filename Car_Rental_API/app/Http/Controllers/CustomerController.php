<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        return response()->json(Customer::all());
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:customers,email',
            'national_id' => 'required|string|unique:customers,national_id',
            'phone_number' => 'required|string',
        ]);

        $customer = Customer::create($fields);

        return response()->json([
            'message' => 'تم تسجيل العميل بنجاح ',
            'data' => $customer
        ], 201);
    }

    public function show(Customer $customer)
    {
        return response()->json($customer->load('rentals'));
    }

    public function update(Request $request, Customer $customer)
    {
        $fields = $request->validate([
            'name' => 'sometimes|string',
            'national_id' => 'sometimes|string|unique:customers,national_id,' . $customer->id,
            'email' => 'sometimes|email|unique:customers,email,' . $customer->id,
            'phone_number' => 'sometimes|string',
        ]);

        $customer->update($fields);

        return response()->json([
            'message' => 'تم تحديث بيانات العميل ',
            'data' => $customer
        ]);
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response()->json(['message' => 'تم حذف العميل ']);
    }
}
