<?php

use App\Models\User;
use App\Models\Room;
use App\Models\Package;
use App\Models\Coupon;
use App\Models\Service;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Enums\RoomStatus;
use App\Enums\RoomType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    // 1. Create Room
    $this->room = Room::create([
        'room_number' => '101',
        'floor' => 1,
        'type' => RoomType::SUITE,
        'view' => \App\Enums\RoomView::SEA,
        'price_per_night' => 1000,
        'status' => RoomStatus::AVAILABLE,
    ]);

    // 2. Create Package
    $this->package = Package::create([
        'name' => 'Basic',
        'type' => \App\Enums\PackageType::BASIC,
        'price_multiplier' => 1.0,
        'features' => ['Wifi'],
    ]);

    // 3. Create Coupon
    $this->coupon = Coupon::create([
        'code' => 'SUMMER2026',
        'type' => 'percent',
        'value' => 10, // 10% discount
    ]);

    // 4. Create Service
    $this->service = Service::create([
        'name' => 'Burger',
        'price' => 50,
        'category' => 'Food'
    ]);
});

test('Full Hotel Booking Scenario', function () {
    // ==========================================
    // Chapter 1: The Guest 👤
    // ==========================================

    // 1. Register
    $registerResponse = $this->postJson('/api/auth/register', [
        'name' => 'Ahmed Guest',
        'email' => 'ahmed@stayease.com',
        'phone' => '0500000000',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);
    $registerResponse->assertStatus(201);

    // Manually activate user (skip OTP for test speed)
    $user = User::where('email', 'ahmed@stayease.com')->first();
    $user->update(['status' => UserStatus::ACTIVE]);

    // Login
    $loginResponse = $this->postJson('/api/auth/login', [
        'email' => 'ahmed@stayease.com',
        'password' => 'password123',
    ]);
    $token = $loginResponse->json('data.token');

    // ==========================================
    // Chapter 2: Search & Book 🏨
    // ==========================================

    // 2. Search
    $searchResponse = $this->getJson('/api/rooms/search?view=sea');
    $searchResponse->assertStatus(200)
                   ->assertJsonCount(1, 'rooms');

    // 3. Book (2 nights = 2000 - 10% = 1800)
    $bookingResponse = $this->postJson('/api/bookings', [
        'room_id' => $this->room->id,
        'package_id' => $this->package->id,
        'check_in' => now()->addDay()->format('Y-m-d'),
        'check_out' => now()->addDays(3)->format('Y-m-d'),
        'coupon_code' => 'SUMMER2026',
        'notes' => 'I need extra pillows',
    ], ['Authorization' => "Bearer $token"]);

    $bookingResponse->assertStatus(201);
    $bookingId = $bookingResponse->json('booking.id');

    // Verify Price
    expect($bookingResponse->json('booking.total_price'))->toEqual(1800);

    // ==========================================
    // Chapter 3: Room Service 🍔
    // ==========================================

    // 4. Order Burger
    $orderResponse = $this->postJson('/api/services/order', [
        'booking_id' => $bookingId,
        'service_id' => $this->service->id,
        'quantity' => 2,
    ], ['Authorization' => "Bearer $token"]);

    $orderResponse->assertStatus(200);

    // ==========================================
    // Chapter 4: The Admin 👮‍♂️
    // ==========================================

    // Create Admin
    $admin = User::create([
        'name' => 'Admin Boss',
        'email' => 'admin@stayease.com',
        'phone' => '0599999999',
        'password' => Hash::make('password'),
        'status' => UserStatus::ACTIVE,
    ]);

    // Force update role directly in DB
    DB::table('users')->where('id', $admin->id)->update(['role' => 'admin']);
    $admin->refresh();

    // Use Sanctum::actingAs to bypass token issues in test environment
    Sanctum::actingAs($admin, ['*']);

    // 5. Check Dashboard
    $dashboardResponse = $this->getJson('/api/admin/dashboard');

    $dashboardResponse->assertStatus(200)
                      ->assertJsonPath('total_revenue', 1800);
});
