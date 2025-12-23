<?php

namespace App\Http\Controllers;

use App\Models\Departments;
use App\Http\Requests\StoreDepartmentsRequest;
use App\Http\Requests\UpdateDepartmentsRequest;

class DepartmentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Departments::all());
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDepartmentsRequest $request)
    {
        $data = $request->validated();
        $department = Departments::create($data);
        return response()->json($department, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Departments $department)
    {
        return response()->json($department);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDepartmentsRequest $request, Departments $department)
    {
        $data = $request->validated();
        $department->update($data);
        return response()->json($department);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Departments $department)
    {
        $department->delete();
        return response()->json(
            [
                'message' => 'Department deleted successfully',
            ]
        );
    }
}
