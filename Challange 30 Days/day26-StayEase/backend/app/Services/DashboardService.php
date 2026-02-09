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
        // 1. Revenue
        $revenue = Booking::whereIn('status', [BookingStatus::CONFIRMED, BookingStatus::COMPLETED])
            ->sum('total_price');

        // 2. Room Stats
        $totalRooms = Room::count();
        $occupiedRooms = Room::where('status', RoomStatus::OCCUPIED)->count();
        $availableRooms = Room::where('status', RoomStatus::AVAILABLE)->count();
        $maintenanceRooms = Room::where('status', RoomStatus::MAINTENANCE)->count();

        // 3. Booking Stats
        $totalBookings = Booking::count();
        $pendingBookings = Booking::where('status', BookingStatus::PENDING)->count();

        // Active bookings: Confirmed and currently within the stay period (or just confirmed for simplicity if dates aren't strict)
        // For now, let's assume 'Active' means 'Confirmed' status which implies they are upcoming or current.
        // A better definition might be check_in <= today <= check_out AND status = confirmed.
        $activeBookings = Booking::where('status', BookingStatus::CONFIRMED)
            ->whereDate('check_in', '<=', Carbon::now())
            ->whereDate('check_out', '>=', Carbon::now())
            ->count();

        $todayArrivals = Booking::whereDate('check_in', Carbon::today())
            ->where('status', BookingStatus::CONFIRMED)
            ->count();

        // 4. Recent Bookings
        $recentBookings = Booking::with(['user', 'room'])
            ->latest()
            ->take(5)
            ->get();

        // 5. Monthly Revenue (Simple chart data for current year)
        // 5. Monthly Revenue (Database Agnostic via Collections)
        $monthlyRevenue = Booking::whereIn('status', [BookingStatus::CONFIRMED, BookingStatus::COMPLETED])
            ->whereYear('created_at', Carbon::now()->year)
            ->get()
            ->groupBy(function ($booking) {
                return $booking->created_at->format('M');
            })
            ->map(function ($bookings, $month) {
                return [
                    'month' => $month,
                    'revenue' => $bookings->sum('total_price')
                ];
            })
            ->values()
            ->toArray();

        return [
            'total_revenue' => $revenue,
            'total_bookings' => $totalBookings,
            'active_bookings' => $activeBookings, // Currently staying
            'available_rooms' => $availableRooms,
            'occupied_rooms' => $occupiedRooms,
            'maintenance_rooms' => $maintenanceRooms,
            'occupancy_rate' => $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 1) : 0,
            'pending_bookings' => $pendingBookings,
            'today_arrivals' => $todayArrivals,
            'recent_bookings' => $recentBookings,
            'monthly_revenue' => $monthlyRevenue,
        ];
    }
}
