<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\Shipment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Super Admin 👑
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@fleet.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // 2. Dispatcher (Employee) 👨‍💼
        User::factory()->create([
            'name' => 'Dispatcher John',
            'email' => 'dispatcher@fleet.com',
            'password' => bcrypt('password'),
            'role' => 'dispatcher',
        ]);

        // 3. Main Test Driver 🚚
        $mainDriverUser = User::factory()->create([
            'name' => 'Captain Ahmed',
            'email' => 'driver@fleet.com',
            'password' => bcrypt('password'),
            'role' => 'driver',
        ]);

        $mainDriver = Driver::create([
            'user_id' => $mainDriverUser->id,
            'license_number' => 'DL-MAIN-001',
            'status' => 'online',
            'current_lat' => 24.7136,
            'current_lng' => 46.6753,
            'last_location_update' => now(),
        ]);

        // 4. Create Vehicles 🚛
        $vehicles = [];
        $types = ['truck', 'van', 'bike'];

        for ($i = 1; $i <= 20; $i++) {
            $vehicles[] = Vehicle::create([
                'plate_number' => 'KSA-' . rand(1000, 9999),
                'type' => $types[array_rand($types)],
                'capacity_kg' => rand(500, 5000),
                'status' => 'active',
            ]);
        }

        // Assign a vehicle to the main driver
        $mainDriver->update(['current_vehicle_id' => $vehicles[0]->id]);

        // 5. Create 10 Dummy Drivers in Riyadh 📍
        for ($i = 1; $i <= 10; $i++) {
            $lat = 24.7136 + (rand(-500, 500) / 10000);
            $lng = 46.6753 + (rand(-500, 500) / 10000);

            $u = User::factory()->create([
                'name' => "Driver $i",
                'email' => "driver$i@fleet.com",
                'password' => bcrypt('password'),
                'role' => 'driver',
            ]);

            $d = Driver::create([
                'user_id' => $u->id,
                'license_number' => 'DL-' . rand(10000, 99999),
                'status' => 'online',
                'current_lat' => $lat,
                'current_lng' => $lng,
                'last_location_update' => now(),
                'current_vehicle_id' => $vehicles[$i]->id, // Assign vehicle
            ]);
        }

        // 6. Create Shipments 📦
        // Pending Shipments
        for ($i = 0; $i < 5; $i++) {
            Shipment::create([
                'tracking_number' => 'TRK-' . Str::upper(Str::random(8)),
                'pickup_address' => 'Riyadh Warehouse',
                'pickup_lat' => 24.7136,
                'pickup_lng' => 46.6753,
                'delivery_address' => 'Customer Location ' . $i,
                'delivery_lat' => 24.7500 + ($i * 0.01),
                'delivery_lng' => 46.7000 + ($i * 0.01),
                'status' => 'pending',
            ]);
        }

        // Assigned Shipments (to Main Driver)
        for ($i = 0; $i < 3; $i++) {
            Shipment::create([
                'tracking_number' => 'TRK-' . Str::upper(Str::random(8)),
                'pickup_address' => 'Riyadh Warehouse',
                'pickup_lat' => 24.7136,
                'pickup_lng' => 46.6753,
                'delivery_address' => 'VIP Customer ' . $i,
                'delivery_lat' => 24.8000,
                'delivery_lng' => 46.8000,
                'status' => 'assigned',
                'driver_id' => $mainDriver->id,
            ]);
        }
    }
}
