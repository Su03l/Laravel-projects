<?php

namespace App\Http\Controllers;

use App\Models\Employees;
use App\Http\Requests\StoreEmployeesRequest;
use App\Http\Requests\UpdateEmployeesRequest;

class EmployeesController extends Controller
{
    public function index()
    {
        $employees = Employees::with('department')->get();
        return response()->json($employees);
    }

    public function store(StoreEmployeesRequest $request)
    {
        $data = $request->validated();

        $employee = Employees::create($data);

        return response()->json($employee, 201);
    }

    public function show(Employees $employee)
    {
        return response()->json($employee);
    }

    public function update(UpdateEmployeesRequest $request, Employees $employee)
    {
        $data = $request->validated();
        $employee->update($data);
        return response()->json($employee);
    }

    public function destroy(Employees $employee)
    {
        $employee->delete();
        return response()->json(
            [
                'message' => 'Employee deleted successfully',
            ]
        );
    }
}
