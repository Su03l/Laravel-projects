<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\HiddenMessage;
use App\Models\Message;
use App\Models\Participant;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request, $conversationId)
    {
        $userId = auth()->id();

        // أ. التحقق من أن المستخدم مشارك في المحادثة
        $isParticipant = Participant::where('conversation_id', $conversationId)
            ->where('user_id', $userId)
            ->exists();

        if (!$isParticipant) {
            return response()->json([
                'message' => 'غير مصرح لك بدخول هذه المحادثة'
            ], 403);
        }

        // تحديث حالة القراءة للرسائل الواردة
        Message::where('conversation_id', $conversationId)
            ->where('user_id', '!=', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        // ب. جلب الرسائل + فلتر الإخفاء
        $messages = Message::where('conversation_id', $conversationId)
            ->whereDoesntHave('hiddenFor', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->with(['sender:id,name,avatar', 'replyTo'])
            ->latest()
            ->paginate(20);

        return response()->json($messages);
    }

    /**
     * 2. إرسال رسالة جديدة
     */
    public function store(Request $request, $conversationId)
    {
        $request->validate([
            'body' => 'nullable|string',
            'file' => 'nullable|file|max:10240', // 10MB Max
            'type' => 'in:text,image,file,video',
        ]);

        $conversation = Conversation::findOrFail($conversationId);

        // تحقق إضافي: هل أنا عضو؟
        if (!Participant::where('conversation_id', $conversationId)->where('user_id', auth()->id())->exists()) {
            return response()->json(['message' => 'غير مصرح لك'], 403);
        }

        $data = [
            'conversation_id' => $conversationId,
            'user_id' => auth()->id(),
            'body' => $request->body,
            'type' => $request->type ?? 'text',
            'reply_to_id' => $request->reply_to_id,
        ];

        // معالجة الملفات
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('chat_attachments', 'public');
            $data['attachment_url'] = $path;

            // تحديد النوع تلقائياً إذا لم يرسله الفرونت إند
            if (!$request->type) {
                $mime = $request->file('file')->getMimeType();
                if (str_contains($mime, 'image')) {
                    $data['type'] = 'image';
                } elseif (str_contains($mime, 'video')) {
                    $data['type'] = 'video';
                } else {
                    $data['type'] = 'file';
                }
            }
        }

        $message = Message::create($data);

        // تحديث المحادثة لتظهر في الأعلى
        $preview = $request->hasFile('file') ? '📎 مرفق' : substr($request->body, 0, 50);
        $conversation->update([
            'last_message_preview' => $preview,
            'last_message_at' => now(),
        ]);

        return response()->json([
            'message' => 'تم الإرسال',
            'data' => $message->load('sender:id,name,avatar')
        ]);
    }

    /**
     * 3. تعديل الرسالة (Edit Message)
     */
    public function update(Request $request, $id)
    {
        $request->validate(['body' => 'required|string']);

        $message = Message::findOrFail($id);

        // شروط التعديل:
        // 1. أنا صاحب الرسالة
        if ($message->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'لا تملك صلاحية التعديل'
            ], 403);
        }

        // 2. لم يمر 15 دقيقة
        if ($message->created_at->diffInMinutes(now()) > 15) {
            return response()->json([
                'message' => 'انتهت مهلة التعديل (15 دقيقة)'
            ], 400);
        }

        // 3. النوع نصي فقط
        if ($message->type !== 'text') {
            return response()->json([
                'message' => 'يمكن تعديل النصوص فقط'
            ], 400);
        }

        $message->update([
            'body' => $request->body,
            'is_edited' => true
        ]);

        return response()->json([
            'message' => 'تم التعديل',
            'data' => $message
        ]);
    }

    /**
     * 4. حذف الرسالة (Delete Message)
     */
    public function destroy(Request $request, $id)
    {
        $request->validate([
            'mode' => 'in:me,everyone'
        ]);

        $message = Message::findOrFail($id);
        $userId = auth()->id();
        $mode = $request->mode ?? 'me';

        // الحالة 1: حذف لدى الجميع
        if ($mode === 'everyone') {
            if ($message->user_id !== $userId) {
                return response()->json([
                    'message' => 'يمكنك الحذف لدى الجميع لرسائلك فقط'
                ], 403);
            }

            $message->delete();

            return response()->json([
                'message' => 'تم الحذف لدى الجميع'
            ]);
        } // الحالة 2: حذف لدي فقط (For Me)
        else {
            HiddenMessage::firstOrCreate([
                'user_id' => $userId,
                'message_id' => $message->id
            ]);

            return response()->json([
                'message' => 'تم الحذف من عندك فقط'
            ]);
        }
    }

    /**
     * تحديد رسالة كمقروءة (يدوياً إذا لزم الأمر)
     */
    public function markAsRead($conversationId)
    {
        Message::where('conversation_id', $conversationId)
            ->where('user_id', '!=', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        return response()->json(['message' => 'تم تحديد الرسائل كمقروءة']);
    }
}
