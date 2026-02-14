<?php

namespace App\Events;

use App\Models\Driver;
use App\Http\Resources\DriverResource;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DriverLocationUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $data;

    public function __construct(Driver $driver)
    {
        $this->data = new DriverResource($driver);
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('fleet'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'driver.moved';
    }
}
