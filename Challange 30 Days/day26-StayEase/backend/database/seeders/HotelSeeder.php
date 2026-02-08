<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;
use App\Models\Amenity;
use App\Models\Package;
use App\Models\Service;
use App\Models\RoomImage;
use App\Models\User;
use App\Models\Booking;
use App\Models\Review;
use App\Enums\RoomType;
use App\Enums\RoomView;
use App\Enums\RoomStatus;
use App\Enums\PackageType;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Enums\BookingStatus;
use Illuminate\Support\Facades\Hash;

class HotelSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🏗️  Building the Hotel...');

        // 1. Create Amenities
        $wifi = Amenity::create(['name' => 'Wi-Fi 5G', 'icon' => 'wifi.svg']);
        $ac = Amenity::create(['name' => 'Central AC', 'icon' => 'ac.svg']);
        $tv = Amenity::create(['name' => 'Smart TV 65"', 'icon' => 'tv.svg']);
        $pool = Amenity::create(['name' => 'Pool Access', 'icon' => 'pool.svg']);
        $gym = Amenity::create(['name' => 'Gym Access', 'icon' => 'gym.svg']);
        $jacuzzi = Amenity::create(['name' => 'Private Jacuzzi', 'icon' => 'jacuzzi.svg']);
        $massage = Amenity::create(['name' => 'Massage Session', 'icon' => 'massage.svg']);

        // 2. Create Packages
        $basicPackage = Package::create([
            'name' => 'Basic Stay',
            'type' => PackageType::BASIC,
            'price_multiplier' => 1.0,
            'features' => ['Wi-Fi', 'Room Only'],
        ]);

        $halfBoardPackage = Package::create([
            'name' => 'Half-Board Deluxe',
            'type' => PackageType::HALF_BOARD,
            'price_multiplier' => 1.25,
            'features' => ['Breakfast & Dinner', 'Pool & Gym'],
        ]);

        $royalPackage = Package::create([
            'name' => 'Royal All-Inclusive',
            'type' => PackageType::ALL_INCLUSIVE,
            'price_multiplier' => 1.60,
            'features' => ['All Meals', 'Open Drinks', 'Massage', 'VIP Check-in'],
        ]);

        $packages = [$basicPackage, $halfBoardPackage, $royalPackage];

        // 3. Build Rooms (10 floors x 10 rooms)
        $rooms = [];
        for ($floor = 1; $floor <= 10; $floor++) {
            for ($i = 1; $i <= 10; $i++) {
                $roomNumber = ($floor * 100) + $i;

                if ($floor <= 3) {
                    $type = RoomType::STANDARD;
                    $price = 450;
                    $view = RoomView::CITY;
                } elseif ($floor <= 6) {
                    $type = RoomType::DOUBLE;
                    $price = 700;
                    $view = RoomView::GARDEN;
                } elseif ($floor <= 9) {
                    $type = RoomType::SUITE;
                    $price = 1200;
                    $view = RoomView::POOL;
                } else {
                    $type = ($i % 2 == 0) ? RoomType::ROYAL_SUITE : RoomType::HONEYMOON;
                    $price = 3500;
                    $view = RoomView::SEA;
                }

                $room = Room::create([
                    'room_number' => $roomNumber,
                    'floor' => $floor,
                    'type' => $type,
                    'view' => $view,
                    'price_per_night' => $price,
                    'capacity_adults' => ($type === RoomType::STANDARD) ? 2 : 4,
                    'capacity_kids' => 2,
                    'size_sqm' => ($floor * 10) + 20,
                    'status' => RoomStatus::AVAILABLE,
                ]);

                $room->amenities()->attach([$wifi->id, $ac->id, $tv->id]);
                if ($floor > 6) $room->amenities()->attach([$pool->id, $gym->id]);
                if ($floor == 10) $room->amenities()->attach([$jacuzzi->id, $massage->id]);

                // Images
                RoomImage::create(['room_id' => $room->id, 'image_path' => 'https://placehold.co/600x400?text=Room+' . $room->room_number, 'is_featured' => true]);
                RoomImage::create(['room_id' => $room->id, 'image_path' => 'https://placehold.co/600x400?text=Bathroom', 'is_featured' => false]);

                $rooms[] = $room;
            }
        }

        // 4. Room Service Menu
        $services = [
            ['name' => 'Club Sandwich', 'price' => 45.00, 'category' => 'Food'],
            ['name' => 'Angus Burger', 'price' => 65.00, 'category' => 'Food'],
            ['name' => 'Pepsi', 'price' => 10.00, 'category' => 'Drinks'],
            ['name' => 'Massage', 'price' => 350.00, 'category' => 'Wellness'],
        ];
        $serviceModels = [];
        foreach ($services as $s) {
            $serviceModels[] = Service::create($s);
        }

        // 5. Create Users (5 Admins + 5000 Customers)
        $this->command->info('👥 Creating Users (This might take a moment)...');

        // Admins
        User::factory()->count(5)->create([
            'role' => UserRole::ADMIN,
            'password' => Hash::make('admin123'), // Unified password for testing
        ]);

        // Customers
        $customers = User::factory()->count(5000)->create();

        // 6. Create Realistic Bookings (Simulation)
        $this->command->info('📅 Simulating Bookings & Operations...');

        // We will book 40% of the rooms
        $roomsToBook = collect($rooms)->random(40); // 40 rooms

        foreach ($roomsToBook as $room) {
            // Each room gets 1-3 bookings in the timeline
            $bookingsCount = rand(1, 3);

            for ($k = 0; $k < $bookingsCount; $k++) {
                $customer = $customers->random();
                $package = $packages[array_rand($packages)];

                // Create Booking via Factory
                $booking = Booking::factory()->create([
                    'user_id' => $customer->id,
                    'room_id' => $room->id,
                    'package_id' => $package->id,
                    'total_price' => $room->price_per_night * rand(2, 5) * $package->price_multiplier,
                ]);

                // If Completed -> Add Review
                if ($booking->status === BookingStatus::COMPLETED) {
                    Review::create([
                        'user_id' => $customer->id,
                        'room_id' => $room->id,
                        'booking_id' => $booking->id,
                        'rating' => rand(3, 5),
                        'comment' => fake()->sentence(),
                    ]);
                }

                // If Confirmed (Active) -> Add Room Service Order
                if ($booking->status === BookingStatus::CONFIRMED && rand(0, 1)) {
                    $service = $serviceModels[array_rand($serviceModels)];
                    $booking->services()->attach($service->id, [
                        'quantity' => rand(1, 3),
                        'price_at_order' => $service->price,
                        'status' => 'delivered'
                    ]);
                }
            }

            // Mark room as occupied if it has an active booking today
            // (Simplified logic: just mark some as occupied for the dashboard)
            if (rand(0, 1)) {
                $room->update(['status' => RoomStatus::OCCUPIED]);
            }
        }

        $this->command->info('✅ Hotel Simulation Ready! Enjoy your stay.');
    }
}
