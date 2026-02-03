<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'غير مصرح لك بتعديل هذا التعليق'], 403);
        }

        $request->validate([
            'body' => 'required|string'
        ]);

        $comment->update(['body' => $request->body]);

        return response()->json(['message' => 'تم تعديل التعليق', 'comment' => $comment]);
    }

    public function destroy($id)
    {
        $comment = Comment::with('task.group.users')->findOrFail($id);
        $user = Auth::user();

        // 1. Owner of the comment
        if ($comment->user_id === $user->id) {
            $comment->delete();
            return response()->json(['message' => 'تم حذف التعليق']);
        }

        // 2. Admin of the group (if task belongs to group)
        if ($comment->task->group_id) {
            $groupUser = $comment->task->group->users()->where('user_id', $user->id)->first();
            if ($groupUser && $groupUser->pivot->role === 'admin') {
                $comment->delete();
                return response()->json(['message' => 'تم حذف التعليق (بصلاحية المدير)']);
            }
        }

        return response()->json(['message' => 'غير مصرح لك بحذف هذا التعليق'], 403);
    }
}
