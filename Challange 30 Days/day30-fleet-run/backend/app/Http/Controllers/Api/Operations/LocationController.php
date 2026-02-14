<?php

namespace App\Http\Controllers\Api\Operations;

use App\Http\Controllers\Controller;
use App\Http\Requests\Operations\UpdateLocationRequest;
use App\Events\DriverLocationUpdated;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    use ApiResponseTrait;

    public function update(UpdateLocationRequest $request)
    {
        $user = $request->user();

        if (!$user->driver) {
            return $this->errorResponse('User is not a driver', 403);
        }

        $driver = $user->driver;

        $driver->update([
            'current_lat' => $request->lat,
            'current_lng' => $request->lng,
            'status' => $request->status ?? $driver->status,
            'last_location_update' => now(),
        ]);

        broadcast(new DriverLocationUpdated($driver));

        return $this->successResponse(null, 'Location updated & broadcasted');
    }
}
