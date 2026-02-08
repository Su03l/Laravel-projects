<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Room;
use App\Enums\BookingStatus;
use App\Enums\RoomStatus;
use Carbon\Carbon;

class DashboardService
{
    public function getStats(): array
    {
        $revenue = Booking::whereIn('status', [BookingStatus::CONFIRMED, BookingStatus::COMPLETED])
            ->sum('total_price');

        $occupiedRooms = Room::where('status', RoomStatus::OCCUPIED)->count();
        $totalRooms = Room::count();

        $todayArrivals = Booking::whereDate('check_in', Carbon::today())
            ->where('status', BookingStatus::CONFIRMED)
            ->count();

        $maintenanceRooms = Room::where('status', RoomStatus::MAINTENANCE)->count();

        return [
            'total_revenue' => $revenue,
            'occupancy_rate' => $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 1) . '%' : '0%',
            'today_arrivals' => $todayArrivals,
            'maintenance_rooms' => $maintenanceRooms,
        ];
    }
}
