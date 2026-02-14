<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Fleet channel: accessible by authenticated users (e.g., admins/dispatchers)
Broadcast::channel('fleet', function ($user) {
    return $user !== null;
});

// Driver specific channel (for notifications)
Broadcast::channel('driver.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
