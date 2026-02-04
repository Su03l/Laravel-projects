<?php

namespace App\Http\Controllers\chat;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    public function checkNumber(Request $request)
    {
        $request->validate([
            'phone' => 'required'
        ]);

        // نبحث عن المستخدم
        $user = User::where('phone', $request->phone)
            ->where('id', '!=', auth()->id()) // عشان ما يطلع رقمي أنا
            ->select('id', 'name', 'phone', 'avatar', 'about', 'is_online', 'last_seen_at')
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'المستخدم غير موجود'
            ], 404);
        }

        return response()->json([
            'user' => $user
        ]);
    }

    public function startChat(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $myId = auth()->id();
        $targetId = $request->user_id;

        // أ. محاولة العثور على محادثة فردية (Non-Group) موجودة مسبقاً
        $conversation = Conversation::where('is_group', false)
            ->whereHas('participants', function ($q) use ($myId) {
                $q->where('user_id', $myId);
            })
            ->whereHas('participants', function ($q) use ($targetId) {
                $q->where('user_id', $targetId);
            })
            ->first();

        // ب. إذا وجدناها، نرجعها فوراً
        if ($conversation) {
            if ($conversation->trashed()) {
                $conversation->restore();
            }
            return response()->json([
                'message' => 'المحادثة موجودة مسبقاً',
                'conversation_id' => $conversation->id,
                'is_new' => false
            ]);
        }

        // ج. إذا لم توجد، ننشئ واحدة جديدة
        $newConversation = DB::transaction(function () use ($myId, $targetId) {
            $conv = Conversation::create([
                'is_group' => false,
                'last_message_at' => now(),
            ]);

            $conv->participants()->attach([
                $myId => ['joined_at' => now()],
                $targetId => ['joined_at' => now()]
            ]);

            return $conv;
        });

        return response()->json([
            'message' => 'تم بدء محادثة جديدة',
            'conversation_id' => $newConversation->id,
            'is_new' => true
        ]);
    }

    /**
     * إنشاء مجموعة جديدة
     */
    public function createGroup(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'participants' => 'required|array|min:1',
            'participants.*' => 'exists:users,id',
            'image' => 'nullable|image|max:5120'
        ]);

        $path = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('groups', 'public');
        }

        $conversation = DB::transaction(function () use ($request, $path) {
            $conv = Conversation::create([
                'is_group' => true,
                'group_name' => $request->name,
                'group_image' => $path,
                'admin_id' => auth()->id(),
                'last_message_at' => now(),
                'last_message_preview' => 'تم إنشاء المجموعة'
            ]);

            // إضافة الأدمن
            $conv->participants()->attach(auth()->id(), ['is_admin' => true, 'joined_at' => now()]);

            // إضافة الأعضاء
            foreach ($request->participants as $userId) {
                $conv->participants()->attach($userId, ['joined_at' => now()]);
            }

            return $conv;
        });

        return response()->json([
            'message' => 'تم إنشاء المجموعة بنجاح',
            'conversation_id' => $conversation->id
        ]);
    }

    /**
     * تحديث بيانات المجموعة
     */
    public function updateGroup(Request $request, $id)
    {
        $request->validate([
            'name' => 'nullable|string|max:50',
            'image' => 'nullable|image|max:5120'
        ]);

        $conv = Conversation::findOrFail($id);

        // التحقق من الصلاحية (أدمن فقط)
        if (!$conv->is_group || $conv->admin_id != auth()->id()) {
            return response()->json(['message' => 'غير مصرح لك'], 403);
        }

        $data = [];
        if ($request->name) $data['group_name'] = $request->name;
        if ($request->hasFile('image')) {
            $data['group_image'] = $request->file('image')->store('groups', 'public');
        }

        $conv->update($data);

        return response()->json(['message' => 'تم تحديث المجموعة', 'conversation' => $conv]);
    }

    public function index(Request $request)
    {
        $user = $request->user();

        // هل يريد المحادثات المقفلة؟ (type=locked)
        $showLocked = $request->query('type') === 'locked';

        $conversations = $user->conversations()
            ->where('is_locked', $showLocked)
            ->with(['users' => function ($q) use ($user) {
                // نجيب بيانات الطرف الثاني فقط
                $q->where('users.id', '!=', $user->id)
                    ->select('users.id', 'name', 'phone', 'avatar', 'is_online');
            }])
            // حساب عدد الرسائل غير المقروءة
            ->withCount(['messages as unread_count' => function ($query) use ($user) {
                $query->where('user_id', '!=', $user->id)
                      ->where('is_read', false)
                      ->whereDoesntHave('hiddenFor', function ($q) use ($user) {
                          $q->where('user_id', $user->id);
                      });
            }])
            ->get()
            ->map(function ($conv) use ($user) {
                $otherUser = $conv->is_group ? null : $conv->users->first();

                $phone = $otherUser?->phone;
                if ($conv->is_phone_hidden) {
                    $phone = '******';
                }

                return [
                    'id' => $conv->id,
                    'is_group' => $conv->is_group,
                    'name' => $conv->is_group ? $conv->group_name : $otherUser?->name,
                    'avatar' => $conv->is_group ? $conv->group_image : $otherUser?->avatar,
                    'phone' => $phone,
                    'is_online' => $conv->is_group ? false : ($otherUser?->is_online ?? false),
                    'last_message' => $conv->last_message_preview,
                    'time' => $conv->last_message_at?->diffForHumans(),
                    'unread_count' => $conv->unread_count,
                ];
            });

        return response()->json($conversations);
    }

    /**
     * قفل / فتح المحادثة
     */
    public function toggleLock($id)
    {
        $user = auth()->user();
        $conv = Conversation::findOrFail($id);

        // التحقق من أن المستخدم مشارك
        if (!$conv->participants()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'غير مصرح لك'], 403);
        }

        // ملاحظة: حسب تصميم قاعدة البيانات الحالي، القفل يتم على مستوى المحادثة للجميع
        $conv->update(['is_locked' => !$conv->is_locked]);

        return response()->json([
            'message' => $conv->is_locked ? 'تم قفل المحادثة' : 'تم فتح المحادثة',
            'is_locked' => $conv->is_locked
        ]);
    }

    public function destroy($id)
    {
        $user = auth()->user();

        $participant = Participant::where('conversation_id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$participant) {
            return response()->json([
                'message' => 'المحادثة غير موجودة أو تم حذفها مسبقاً'
            ], 404);
        }

        $participant->delete();

        $remainingMembers = Participant::where('conversation_id', $id)->count();

        if ($remainingMembers === 0) {
            Conversation::where('id', $id)->delete();
        }

        return response()->json([
            'message' => 'تم حذف المحادثة بنجاح'
        ]);
    }
}
