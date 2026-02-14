<?php

namespace App\Http\Controllers\Api\Fleet;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Driver;
use App\Http\Resources\Fleet\DriverResource;
use App\Http\Requests\Fleet\StoreDriverRequest;
use App\Http\Requests\Fleet\UpdateDriverRequest;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DriverController extends Controller
{
    use ApiResponseTrait;

    // the index method for show all drivers
    public function index()
    {
        $drivers = Driver::with(['user', 'vehicle'])->latest()->get();
        return $this->successResponse(DriverResource::collection($drivers), 'Drivers retrieved successfully');
    }

    // the store method for create new driver
    public function store(StoreDriverRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'driver',
            ]);

            $driver = Driver::create([
                'user_id' => $user->id,
                'license_number' => $request->license_number,
                'status' => 'offline',
            ]);

            return $this->successResponse(new DriverResource($driver), 'Driver created successfully', 201);
        });
    }

    // the show method for show driver details
    public function show(Driver $driver)
    {
        $driver->load(['user', 'vehicle']);
        return $this->successResponse(new DriverResource($driver), 'Driver details');
    }

    // the update method for update driver details
    public function update(UpdateDriverRequest $request, Driver $driver)
    {
        $driver->update($request->validated());
        return $this->successResponse(new DriverResource($driver), 'Driver updated successfully');
    }

    public function destroy(Driver $driver)
    {
        $driver->user->delete();
        return $this->successResponse(null, 'Driver and User account deleted successfully');
    }
}
