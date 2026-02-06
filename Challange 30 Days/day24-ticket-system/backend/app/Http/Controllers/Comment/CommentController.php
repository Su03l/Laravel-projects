<?php

namespace App\Http\Controllers\Comment;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Ticket;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * 1. جلب ردود تذكرة معينة
     */
    public function index(Request $request, $ticketUuid)
    {
        $ticket = Ticket::where('uuid', $ticketUuid)->firstOrFail();
        $user = $request->user();

        // التحقق من الصلاحية (العميل يشوف تذكرته بس)
        if ($user->hasRole('Customer') && $ticket->user_id !== $user->id) {
            return response()->json([
                'message' => 'غير مصرح'
            ], 403);
        }

        // بناء الكويري
        $query = $ticket->comments()->with('user:id,name,avatar,email')->latest();

        //  إذا كان عميل، نخفي عنه الملاحظات الداخلية
        if ($user->hasRole('Customer')) {
            $query->where('is_internal', false);
        }

        return response()->json($query->paginate(20));
    }

    /**
     * 2. إضافة رد جديد
     */
    public function store(Request $request, $ticketUuid)
    {
        $ticket = Ticket::where('uuid', $ticketUuid)->firstOrFail();
        $user = $request->user();

        $request->validate([
            'body' => 'required|string',
            'is_internal' => 'boolean', // هل تريدها ملاحظة سرية؟
            'attachment' => 'nullable|file|max:5120' // 5MB
        ]);

        // حماية: العميل لا يستطيع كتابة ملاحظة داخلية
        $isInternal = $request->is_internal ?? false;
        if ($user->hasRole('Customer')) {
            $isInternal = false;

            // تحقق إضافي: هل التذكرة مغلقة؟ العميل ما يقدر يرد على تذكرة مغلقة
            if ($ticket->status === 'closed') {
                return response()->json([
                    'message' => 'لا يمكن الرد على تذكرة مغلقة'
                ], 400);
            }
        }

        // رفع المرفقات
        $path = null;
        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('ticket_attachments', 'public');
        }

        $comment = Comment::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'body' => $request->body,
            'is_internal' => $isInternal,
            'attachment_path' => $path
        ]);

        // تحديث التذكرة: نغير حالتها أحياناً
        // مثلاً: لو العميل رد، نرجع الحالة من "Pending" إلى "Open" عشان ينتبه الموظف
        if ($user->hasRole('Customer')) {
            $ticket->update(['status' => 'open']);
        } // لو الموظف رد، نحولها "Pending" (بانتظار رد العميل)
        elseif (!$isInternal) {
            $ticket->update(['status' => 'pending']);
        }

        return response()->json([
            'message' => 'تم إضافة الرد',
            'comment' => $comment->load('user:id,name,avatar')
        ]);
    }
}
