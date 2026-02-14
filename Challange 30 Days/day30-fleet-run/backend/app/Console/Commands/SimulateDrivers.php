<?php

namespace App\Console\Commands;

use App\Models\Driver;
use App\Events\DriverLocationUpdated;
use Illuminate\Console\Command;

class SimulateDrivers extends Command
{
    protected $signature = 'fleet:simulate';
    protected $description = 'Move drivers randomly around Riyadh';

    public function handle()
    {
        $this->info('Starting simulation... Press Ctrl+C to stop.');

        while(true) {
            $drivers = Driver::where('status', 'online')->get();

            foreach ($drivers as $driver) {
                // Random movement (approx. 10 meters)
                $newLat = $driver->current_lat + (rand(-10, 10) / 10000);
                $newLng = $driver->current_lng + (rand(-10, 10) / 10000);

                $driver->update([
                    'current_lat' => $newLat,
                    'current_lng' => $newLng,
                    'last_location_update' => now()
                ]);

                // Broadcast event
                broadcast(new DriverLocationUpdated($driver));

                $this->info("Moved Driver {$driver->id} to [$newLat, $newLng]");
            }

            sleep(3);
        }
    }
}
