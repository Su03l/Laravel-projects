<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $host = User::factory()->create([
            'name' => 'Host User',
            'email' => 'host@gmail.com',
            'password' => bcrypt('password'),
            'is_host' => true,
        ]);

        $guest = User::factory()->create([
            'name' => 'Guest User',
            'email' => 'guest@gmail.com',
            'password' => bcrypt('password'),
            'is_host' => false,
        ]);

        $listings = Listing::factory(10)->create([
            'user_id' => $host->id,
        ]);

        Booking::factory(5)->create([
            'user_id' => $guest->id,
            'listing_id' => $listings->first()->id,
        ]);

        echo " Database Seeded! \n";
        echo "Host: host@gmail.com \n";
        echo "Guest: guest@gmail.com \n";
        echo "Password: password \n";
    }
}
