<?php

namespace App\Http\Controllers\Api\Operations;

use App\Http\Controllers\Controller;
use App\Http\Requests\Operations\AssignDriverRequest;
use App\Http\Requests\Operations\StoreShipmentRequest;
use App\Http\Requests\Operations\UpdateShipmentStatusRequest;
use App\Http\Resources\Operations\ShipmentResource;
use App\Models\Shipment;
use App\Notifications\ShipmentAssigned;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ShipmentController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = Shipment::with('driver.user')->latest();

        if ($request->user()->role === 'driver' && $request->user()->driver) {
            $query->where('driver_id', $request->user()->driver->id);
        }

        return $this->successResponse(
            ShipmentResource::collection($query->paginate(10)),
            'Shipments retrieved successfully'
        );
    }

    public function store(StoreShipmentRequest $request)
    {
        $trackingNumber = 'TRK-' . strtoupper(Str::random(8));

        $shipment = Shipment::create(array_merge(
            $request->validated(),
            [
                'tracking_number' => $trackingNumber,
                'status' => $request->driver_id ? 'assigned' : 'pending',
            ]
        ));

        return $this->successResponse(
            new ShipmentResource($shipment),
            'Shipment created successfully',
            201
        );
    }

    public function show(Shipment $shipment)
    {
        $shipment->load('driver.user');
        return $this->successResponse(new ShipmentResource($shipment), 'Shipment details');
    }

    public function assignDriver(AssignDriverRequest $request, Shipment $shipment)
    {
        $shipment->update([
            'driver_id' => $request->driver_id,
            'status' => 'assigned'
        ]);

        if ($shipment->driver && $shipment->driver->user) {
            $shipment->driver->user->notify(new ShipmentAssigned($shipment));
        }

        return $this->successResponse(
            new ShipmentResource($shipment->load('driver.user')),
            'Driver assigned successfully'
        );
    }

    public function updateStatus(UpdateShipmentStatusRequest $request, Shipment $shipment)
    {
        $shipment->update(['status' => $request->status]);

        return $this->successResponse(
            new ShipmentResource($shipment->load('driver.user')),
            'Shipment status updated successfully'
        );
    }

    public function completeDelivery(Request $request, Shipment $shipment)
    {
        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        if (!$request->user()->driver || $shipment->driver_id !== $request->user()->driver->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $path = $request->file('image')->store('pods', 'public');

        $shipment->update([
            'status' => 'delivered',
            'proof_of_delivery_path' => $path,
            'delivered_at' => now(),
        ]);

        return $this->successResponse(
            new ShipmentResource($shipment),
            'Shipment delivered successfully'
        );
    }
}
