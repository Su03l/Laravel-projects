<?php

use App\Models\Participant;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Authorize conversation channel - only participants can listen
Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    return Participant::where('conversation_id', $conversationId)
        ->where('user_id', $user->id)
        ->exists();
});
