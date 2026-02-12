<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chat;
use App\Models\Message;
use App\Traits\ApiResponse;
use Exception;

class ChatController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the chats.
     */
    public function index(Request $request)
    {
        try {
            $chats = Chat::where('user_id', $request->user()->id)
                ->latest()
                ->select('id', 'title', 'created_at')
                ->get();

            return $this->success($chats);
        } catch (Exception $e) {
            // إرجاع الخطأ الحقيقي بدلاً من 500 مبهمة
            return $this->error($e->getMessage(), 500);
        }
    }

    /**
     * Display the specified chat with messages.
     */
    public function show(Request $request, $id)
    {
        try {
            $chat = Chat::where('user_id', $request->user()->id)
                ->with('messages')
                ->findOrFail($id);

            return $this->success($chat);
        } catch (Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified chat.
     */
    public function destroy(Request $request, $id)
    {
        try {
            $chat = Chat::where('user_id', $request->user()->id)->findOrFail($id);
            $chat->delete();
            return $this->success(null, 'Chat deleted successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /**
     * Search in messages.
     */
    public function search(Request $request)
    {
        try {
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
        } catch (Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
