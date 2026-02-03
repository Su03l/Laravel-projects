<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Models\Attachment;
use App\Models\Comment;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskInteractionController extends Controller
{
    public function addComment(Request $request, $taskId)
    {
        $request->validate([
            'body' => 'required|string'
        ]);

        $task = Task::findOrFail($taskId);
        $user = Auth::user();

        // تحقق: هل مسموح لي أعلق؟ (لازم أكون عضو في القروب أو صاحب التاسك الشخصي)
        if ($task->group_id) {
            $isMember = $task->group->users()->where('user_id', $user->id)->exists();
            if (!$isMember) return response()->json([
                'message' => 'غير مصرح لك'
            ], 403);
        } else {
            if ($task->user_id !== $user->id) return response()->json([
                'message' => 'غير مصرح لك'
            ], 403);
        }

        $comment = Comment::create([
            'body' => $request->body,
            'task_id' => $task->id,
            'user_id' => $user->id
        ]);

        return response()->json([
                'message' => 'تم إضافة التعليق',
                'comment' => $comment]
        );
    }

    public function uploadAttachment(Request $request, $taskId)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // Max 10MB
        ]);

        $task = Task::findOrFail($taskId);

        // نفس التحقق من الصلاحية (مهم جداً)
        // ... (يمكن وضع التحقق في دالة منفصلة لعدم التكرار)

        if ($request->hasFile('file')) {
            $file = $request->file('file');

            // الاسم الأصلي
            $filename = $file->getClientOriginalName();

            // التخزين في مجلد 'attachments' (تأكد من عمل php artisan storage:link)
            $path = $file->store('attachments', 'public');

            $attachment = Attachment::create([
                'file_path' => $path,
                'file_name' => $filename,
                'file_type' => $file->getClientMimeType(),
                'task_id' => $task->id,
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'message' => 'تم رفع الملف',
                'attachment' => $attachment
            ]);
        }

        return response()->json([
            'message' => 'فشل الرفع'
        ], 400);
    }
}
