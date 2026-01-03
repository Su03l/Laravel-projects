<?php

namespace App\Http\Controllers;

use App\Http\Requests\Ticket\StoreTicketRequest;
use App\Http\Requests\Ticket\UpdateTicketRequest;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();


        $query = Ticket::with('user')->latest();

        if ($user->role->value === 'user') {
            $query->where('user_id', $user->id);
        }


        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return TicketResource::collection($query->paginate(10));
    }

    public function store(StoreTicketRequest $request)
    {
        try {
            DB::beginTransaction();

            $ticket = Ticket::create([
                'user_id' => $request->user()->id,
                'title' => $request->title,
                'description' => $request->description,
                'priority' => $request->priority,
                'status' => 'open',
            ]);

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('tickets_attachments', 'public');

                    $ticket->attachments()->create([
                        'file_path' => $path,
                        'file_name' => $file->getClientOriginalName(),
                        'file_type' => $file->extension(),
                        'file_size' => $file->getSize(),
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Ticket created successfully',
                'data' => new TicketResource($ticket)
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error creating ticket: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request, Ticket $ticket)
    {
        if ($request->user()->role->value !== 'admin' && $ticket->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized access'
            ], 403);
        }

        return new TicketResource($ticket->load(['user', 'attachments']));
    }

    public function update(UpdateTicketRequest $request, Ticket $ticket)
    {
        if ($request->user()->role->value !== 'admin' && $ticket->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        if ($request->user()->role->value === 'user' && $request->has('status')) {
            return response()->json([
                'message' => 'Users cannot change ticket status'
            ], 403);
        }

        $ticket->update($request->validated());

        return response()->json([
            'message' => 'Ticket updated successfully',
            'data' => new TicketResource($ticket)
        ]);
    }

    public function destroy(Request $request, Ticket $ticket)
    {
        if ($request->user()->role->value !== 'admin') {
            return response()->json([
                'message' => 'Only admins can delete tickets'
            ], 403);
        }

        $ticket->delete();

        return response()->json([
            'message' => 'Ticket deleted successfully'
        ]);
    }
}
