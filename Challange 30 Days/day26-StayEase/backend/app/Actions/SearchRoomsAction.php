<?php

namespace App\Actions;

use App\Models\Room;
use App\Enums\RoomStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class SearchRoomsAction
{
    public function execute(array $filters): Collection
    {
        $query = Room::query()->with('images');

        // 1. Exclude rooms under maintenance or cleaning
        $query->where('status', RoomStatus::AVAILABLE);

        // 2. Filter by Type
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        // 3. Filter by View
        if (!empty($filters['view'])) {
            $query->where('view', $filters['view']);
        }

        // 4. Filter by Capacity
        if (!empty($filters['capacity'])) {
            $query->where('capacity_adults', '>=', $filters['capacity']);
        }

        // 5. Filter by Availability (Date Range)
        if (!empty($filters['check_in']) && !empty($filters['check_out'])) {
            $checkIn = $filters['check_in'];
            $checkOut = $filters['check_out'];

            $query->whereDoesntHave('bookings', function (Builder $q) use ($checkIn, $checkOut) {
                $q->where('status', '!=', 'cancelled')
                  ->where('check_in', '<', $checkOut)
                  ->where('check_out', '>', $checkIn);
            });
        }

        return $query->get();
    }
}
