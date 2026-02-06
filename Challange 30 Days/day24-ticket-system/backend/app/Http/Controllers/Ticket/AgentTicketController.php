<?php

namespace App\Http\Controllers\Ticket;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class AgentTicketController extends Controller
{
    /**
     * 1. استلام التذكرة (Assign to Me)
     */
    public function assignSelf($uuid)
    {
        $ticket = Ticket::where('uuid', $uuid)->firstOrFail();

        // هل التذكرة محجوزة أصلاً؟
        if ($ticket->assigned_to && $ticket->assigned_to !== auth()->id()) {
            return response()->json([
                'message' => 'هذه التذكرة محجوزة لموظف آخر'
            ], 400);
        }

        $ticket->update(['assigned_to' => auth()->id()]);

        return response()->json([
            'message' => 'تم تعيين التذكرة لك بنجاح'
        ]);
    }

    /**
     * 2. تحديث حالة التذكرة (Update Status)
     */
    public function updateStatus(Request $request, $uuid)
    {
        $request->validate([
            'status' => 'required|in:open,pending,resolved,closed',
            'priority' => 'nullable|in:low,medium,high,critical' // الموظف يقدر يرفع الأولوية
        ]);

        $ticket = Ticket::where('uuid', $uuid)->firstOrFail();

        $data = ['status' => $request->status];

        // لو تحولت لـ resolved، نسجل الوقت
        if ($request->status === 'resolved' && !$ticket->resolved_at) {
            $data['resolved_at'] = now();
            $data['is_resolved'] = true;
        }

        if ($request->has('priority')) {
            $data['priority'] = $request->priority;
        }

        $ticket->update($data);

        return response()->json([
            'message' => 'تم تحديث التذكرة',
            'ticket' => $ticket
        ]);
    }

    /**
     * 3. بث حدث الكتابة (Typing Event)
     */
    public function broadcastTyping($uuid)
    {
        // يمكن تفعيل هذا الجزء لاحقاً عند استخدام Reverb أو Pusher
        return response()->json(['message' => 'Typing event broadcasted']);
    }
}
