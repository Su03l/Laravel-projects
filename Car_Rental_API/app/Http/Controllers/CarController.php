<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;

class CarController extends Controller
{
    public function index()
    {
        return response()->json(Car::all());
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string',
            'model_year' => 'required|string',
            'license_plate' => 'required|string|unique:cars,license_plate',
            'daily_price' => 'required|numeric|min:0',
        ]);
        $car = Car::create($fields);

        return response()->json([
            'message' => 'تم إضافة السيارة للمعرض بنجاح ',
            'data' => $car
        ], 201);
    }

    public function show(Car $car)
    {
        return response()->json($car);
    }

    public function update(Request $request, Car $car)
    {
        $fields = $request->validate([
            'name' => 'sometimes|string',
            'model_year' => 'sometimes|string',
            'license_plate' => 'sometimes|string|unique:cars,license_plate,' . $car->id,
            'daily_price' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:available,rented,maintenance'
        ]);

        $car->update($fields);

        return response()->json([
            'message' => 'تم تحديث بيانات السيارة ',
            'data' => $car
        ]);
    }

    public function destroy(Car $car)
    {
        if ($car->status === 'rented') {
            return response()->json([
                'message' => 'لا يمكن حذف السيارة لأنها مؤجرة حالياً '
            ], 400);
        }

        $car->delete();

        return response()->json(['message' => 'تم حذف السيارة من المعرض ']);
    }
}
