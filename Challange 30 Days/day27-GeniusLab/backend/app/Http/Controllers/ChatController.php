<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chat;
use App\Models\Message;
use App\Traits\ApiResponse;

class ChatController extends Controller
{
    use ApiResponse;

    // 1. عرض قائمة المحادثات (Sidebar)
    public function index(Request $request)
    {
        $chats = Chat::where('user_id', $request->user()->id)
            ->latest()
            ->select('id', 'title', 'created_at')
            ->get();

        return $this->success($chats);
    }

    // 2. عرض رسائل محادثة معينة
    public function show(Request $request, $id)
    {
        $chat = Chat::where('user_id', $request->user()->id)
            ->with('messages')
            ->findOrFail($id);

        return $this->success($chat);
    }

    // 3. حذف محادثة
    public function destroy(Request $request, $id)
    {
        $chat = Chat::where('user_id', $request->user()->id)->findOrFail($id);
        $chat->delete();
        return $this->success(null, 'Chat deleted successfully');
    }

    // 4. بحث في الرسائل القديمة 🔍
    public function search(Request $request)
    {
        $request->validate(['q' => 'required|string|min:3']);

        $query = $request->q;

        $results = Message::whereHas('chat', function ($q) use ($request) {
                $q->where('user_id', $request->user()->id);
            })
            ->where('content', 'LIKE', "%{$query}%")
            ->with('chat:id,title')
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return $this->success($results);
    }
}
