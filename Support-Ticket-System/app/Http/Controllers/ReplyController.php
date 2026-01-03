<?php

namespace App\Http\Controllers;

use App\Http\Requests\Reply\StoreReplyRequest;
use App\Http\Resources\ReplyResource;
use App\Models\Reply;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReplyController extends Controller
{
    public function index(Ticket $ticket)
    {
        $user = auth()->user();
        if ($user->role->value !== 'admin' && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return ReplyResource::collection($ticket->replies()->with('user')->get());
    }

    public function store(StoreReplyRequest $request, Ticket $ticket)
    {
        $user = $request->user();

        if ($user->role->value !== 'admin' && $ticket->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        if ($ticket->status->value === 'closed') {
            return response()->json([
                'message' => 'Cannot reply to a closed ticket'
            ], 400);
        }

        try {
            DB::beginTransaction();

            $reply = $ticket->replies()->create([
                'user_id' => $user->id,
                'message' => $request->message,
            ]);

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('replies_attachments', 'public');

                    $reply->attachments()->create([
                        'file_path' => $path,
                        'file_name' => $file->getClientOriginalName(),
                        'file_type' => $file->extension(),
                        'file_size' => $file->getSize(),
                    ]);
                }
            }

            if ($user->role->value === 'admin') {
                $ticket->update(['status' => 'in_progress']);
            } else {
                $ticket->update(['status' => 'open']);
            }

            DB::commit();

            return response()->json([
                'message' => 'Reply added successfully',
                'data' => new ReplyResource($reply)
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error adding reply'
            ], 500);
        }
    }
}
