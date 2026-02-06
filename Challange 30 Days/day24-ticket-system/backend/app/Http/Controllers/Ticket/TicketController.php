<?php

namespace App\Http\Controllers\Ticket;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    /**
     * 1. عرض التذاكر (Index)
     * - العميل: يشوف تذاكره بس.
     * - الموظف/المدير: يشوف كل التذاكر (مع فلترة).
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Ticket::with(['category', 'user', 'assignedAgent']);

        // إذا كان عميل عادي، قيد البحث على تذاكره فقط
        if ($user->hasRole('Customer')) {
            $query->where('user_id', $user->id);
        }

        // فلترة حسب الحالة (مفتوحة، مغلقة)
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // فلترة حسب الأولوية
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        return response()->json($query->latest()->paginate(15));
    }

    /**
     * 2. إنشاء تذكرة جديدة (Store) 🎫
     * هنا السحر: حساب الـ SLA
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'priority' => 'in:low,medium,high,critical'
        ]);

        $priority = $request->priority ?? 'low';

        // حساب وقت SLA بناءً على الأولوية
        // Low: 48h, Medium: 24h, High: 12h, Critical: 4h
        $slaDueAt = $this->calculateSla($priority);

        $ticket = Ticket::create([
            'user_id' => auth()->id(),
            'category_id' => $request->category_id,
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $priority,
            'status' => 'open',
            'sla_due_at' => $slaDueAt, //  الوقت المحسوب
        ]);

        return response()->json([
            'message' => 'تم إنشاء التذكرة بنجاح',
            'ticket' => $ticket,
            'ref_id' => $ticket->ref_id // نرجع الرقم المرجعي للعميل
        ], 201);
    }

    /**
     * 3. عرض تذكرة محددة (Show)
     */
    public function show($uuid)
    {
        $ticket = Ticket::where('uuid', $uuid)->with(['category', 'user', 'assignedAgent'])->firstOrFail();

        // الحماية: العميل لا يرى إلا تذكرته
        $user = auth()->user();
        if ($user->hasRole('Customer') && $ticket->user_id !== $user->id) {
            return response()->json([
                'message' => 'غير مصرح لك بمشاهدة هذه التذكرة'
            ], 403);
        }

        return response()->json($ticket);
    }

    /**
     * 4. دالة خاصة لحساب وقت انتهاء التذكرة (SLA Logic)
     */
    private function calculateSla($priority)
    {
        $now = now();

        return match ($priority) {
            'critical' => $now->addHours(4),   // مصيبة! لازم تنحل في 4 ساعات
            'high' => $now->addHours(12),  // مشكلة كبيرة
            'medium' => $now->addHours(24),  // مشكلة عادية
            'low' => $now->addHours(48),  // استفسار بسيط
            default => $now->addHours(48),
        };
    }
}
