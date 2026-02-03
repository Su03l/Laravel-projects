<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $tasks = Task::query();

        // فلتر: إذا أرسلنا group_id نعرض مهام المجموعة فقط
        if ($request->has('group_id')) {
            // تحقق: هل أنا عضو في هذه المجموعة أصلاً؟
            $isMember = $user->groups()->where('groups.id', $request->group_id)->exists();
            if (!$isMember) {
                return response()->json(['message' => 'ليس لديك صلاحية لعرض مهام هذه المجموعة'], 403);
            }
            $tasks->where('group_id', $request->group_id);
        } else {
            // الافتراضي: اعرض مهامي الشخصية (التي لا تنتمي لمجموعة)
            $tasks->where('user_id', $user->id)->whereNull('group_id');
        }

        // نجيب التاسكات مع بيانات المكلف والمجموعة
        return response()->json($tasks->with('assignee:id,first_name,avatar')->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'priority' => 'in:low,medium,high',
            'group_id' => 'nullable|exists:groups,id', // لو فاضي = شخصي
            'assigned_to' => 'nullable|exists:users,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        $user = Auth::user();

        // منطق الصلاحيات للمجموعات
        if ($request->group_id) {
            $group = Group::find($request->group_id);

            // هل أنا عضو؟
            $member = $group->users()->where('user_id', $user->id)->first();

            if (!$member) {
                return response()->json([
                    'message' => 'أنت لست عضواً في هذه المجموعة'
                ], 403);
            }

            // هل أنا أدمن؟ (لأن الأدمن فقط يضيف تاسكات في المجموعة حسب شروطك)
            if ($member->pivot->role !== 'admin') {
                return response()->json([
                    'message' => 'فقط مدير المجموعة يمكنه إضافة مهام'
                ], 403);
            }
        }

        $task = Task::create([
            'title' => $request->title,
            'content' => $request->content,
            'priority' => $request->priority ?? 'medium',
            'user_id' => $user->id, // المنشئ
            'group_id' => $request->group_id,
            'assigned_to' => $request->assigned_to, // لو شخصي بيكون null عادي
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);

        return response()->json([
            'message' => 'تم إضافة المهمة بنجاح',
            'task' => $task
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $user = Auth::user();

        // سيناريو 1: تاسك شخصي
        if (!$task->group_id) {
            if ($task->user_id !== $user->id) {
                return response()->json([
                    'message' => 'هذه المهمة ليست لك'
                ], 403);
            }
            // الشخصي يعدل كل شيء
            $task->update($request->all());
        } // سيناريو 2: تاسك مجموعة
        else {
            // نجيب دوري في المجموعة
            $groupUser = $task->group->users()->where('user_id', $user->id)->first();

            if (!$groupUser) return response()->json([
                'message' => 'ممنوع'
            ], 403);

            $role = $groupUser->pivot->role;

            // إذا أنا "أدمن": أعدل كل شيء
            if ($role === 'admin') {
                $task->update($request->all());
            } // إذا أنا "عضو": مسموح لي فقط أغير الحالة (مكتمل/غير مكتمل)
            else {
                if ($request->hasAny(['title', 'content', 'assigned_to'])) {
                    return response()->json([
                        'message' => 'الأعضاء يمكنهم تغيير حالة المهمة فقط'
                    ], 403);
                }
                // نحدث الحالة فقط
                if ($request->has('is_completed')) {
                    $task->update(['is_completed' => $request->is_completed]);
                }
            }
        }

        return response()->json([
            'message' => 'تم تحديث المهمة',
            'task' => $task
        ]);
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $user = Auth::user();

        // لو شخصي: لازم أكون أنا المالك
        if (!$task->group_id && $task->user_id !== $user->id) {
            return response()->json([
                'message' => 'غير مصرح لك'
            ], 403);
        }

        // لو مجموعة: لازم أكون الأدمن
        if ($task->group_id) {
            $groupUser = $task->group->users()->where('user_id', $user->id)->first();
            if (!$groupUser || $groupUser->pivot->role !== 'admin') {
                return response()->json([
                    'message' => 'فقط مدير المجموعة يحذف المهام'
                ], 403);
            }
        }

        $task->delete();
        return response()->json([
            'message' => 'تم حذف المهمة'
        ]);
    }

    // 5. عرض تفاصيل مهمة (مع التعليقات والمرفقات)
    public function show(Request $request, $id)
    {
        $task = Task::with(['comments.user', 'attachments.user', 'assignee', 'group'])
            ->findOrFail($id);

        $permissions = [
            'can_edit' => false,
            'can_delete' => false,
            'role' => null
        ];

        if ($task->group_id) {
            // Check membership and role
            $groupUser = $task->group->users()->where('user_id', $request->user()->id)->first();
            if (!$groupUser) {
                return response()->json(['message' => 'غير مصرح لك'], 403);
            }

            $role = $groupUser->pivot->role;
            $isGroupOwner = $task->group->owner_id === $request->user()->id;

            $permissions['role'] = $role;
            $permissions['can_edit'] = ($role === 'admin' || $isGroupOwner);
            $permissions['can_delete'] = ($role === 'admin' || $isGroupOwner);
        } else {
            // Private task
            if ($task->user_id !== $request->user()->id) {
                return response()->json(['message' => 'غير مصرح لك'], 403);
            }
            $permissions['can_edit'] = true;
            $permissions['can_delete'] = true;
            $permissions['role'] = 'owner';
        }

        return response()->json([
            'task' => $task,
            'permissions' => $permissions
        ]);
    }
}
