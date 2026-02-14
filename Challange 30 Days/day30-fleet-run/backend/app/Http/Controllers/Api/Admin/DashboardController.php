<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Shipment;
use App\Models\Vehicle;
use App\Traits\ApiResponseTrait;

class DashboardController extends Controller
{
    use ApiResponseTrait;

    public function index()
    {
        $stats = [
            'drivers' => [
                'total' => Driver::count(),
                'active' => Driver::where('status', 'online')->count(),
                'busy' => Driver::where('status', 'busy')->count(),
            ],
            'vehicles' => [
                'total' => Vehicle::count(),
                'maintenance' => Vehicle::where('status', 'maintenance')->count(),
            ],
            'shipments' => [
                'pending' => Shipment::where('status', 'pending')->count(),
                'in_transit' => Shipment::where('status', 'picked_up')->count(),
                'delivered' => Shipment::where('status', 'delivered')->whereDate('updated_at', today())->count(),
            ]
        ];

        return $this->successResponse($stats, 'Dashboard statistics retrieved');
    }
}
