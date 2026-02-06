<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\User;
use App\Models\Ticket;

// 1. قناة خاصة بالمستخدم (للإشعارات الشخصية)
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int)$user->id === (int)$id;
});

// 2. قناة التذكرة (Presence Channel)
// التسمية: ticket.{uuid}
Broadcast::channel('ticket.{uuid}', function ($user, $uuid) {
    // التحقق: هل المستخدم مسموح له بدخول هذه القناة؟
    // الأدمن والموظف مسموح لهم دائماً
    if ($user->hasRole(['Admin', 'Agent'])) {
        // في قنوات Presence، يجب أن نرجع مصفوفة بيانات المستخدم المتصل
        return ['id' => $user->id, 'name' => $user->name, 'avatar' => $user->avatar];
    }

    // العميل مسموح له فقط إذا كانت تذكرته
    $ticket = Ticket::where('uuid', $uuid)->first();
    if ($ticket && $ticket->user_id === $user->id) {
        return ['id' => $user->id, 'name' => $user->name];
    }

    return false; // ممنوع
});
