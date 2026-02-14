<?php

namespace App\Http\Controllers\Api\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Http\Resources\Fleet\VehicleResource;
use App\Http\Requests\Fleet\StoreVehicleRequest;
use App\Http\Requests\Fleet\UpdateVehicleRequest;
use App\Traits\ApiResponseTrait;

class VehicleController extends Controller
{
    use ApiResponseTrait;

    public function index()
    {
        $vehicles = Vehicle::with('driver.user')->latest()->get();
        return $this->successResponse(VehicleResource::collection($vehicles), 'Vehicles retrieved successfully');
    }

    public function store(StoreVehicleRequest $request)
    {
        $vehicle = Vehicle::create($request->validated());
        return $this->successResponse(new VehicleResource($vehicle), 'Vehicle created successfully', 201);
    }

    public function show(Vehicle $vehicle)
    {
        return $this->successResponse(new VehicleResource($vehicle), 'Vehicle details');
    }

    public function update(UpdateVehicleRequest $request, Vehicle $vehicle)
    {
        $vehicle->update($request->validated());
        return $this->successResponse(new VehicleResource($vehicle), 'Vehicle updated successfully');
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        return $this->successResponse(null, 'Vehicle deleted successfully');
    }
}
