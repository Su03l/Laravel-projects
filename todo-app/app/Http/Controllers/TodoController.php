<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TodoController extends Controller
{
    // GET /api/todos
    public function index()
    {
        // Get only the logged-in user's todos
        return response()->json(Auth::user()->todos);
    }

    // POST /api/todos
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Create todo linked to current user
        $todo = Auth::user()->todos()->create([
            'title' => $request->title,
            'description' => $request->description,
            'is_completed' => false,
        ]);

        return response()->json($todo, 201);
    }

    // GET /api/todos/{id}
    public function show(string $id)
    {
        $todo = Auth::user()->todos()->find($id);

        if (!$todo) {
            return response()->json(['message' => 'Todo not found'], 404);
        }

        return response()->json($todo);
    }

    // PUT/PATCH /api/todos/{id}
    public function update(Request $request, string $id)
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'is_completed' => 'boolean'
        ]);

        $todo = Auth::user()->todos()->find($id);

        if (!$todo) {
            return response()->json(['message' => 'Todo not found'], 404);
        }

        $todo->update($request->all());

        return response()->json($todo);
    }

    // DELETE /api/todos/{id}
    public function destroy(string $id)
    {
        $todo = Auth::user()->todos()->find($id);

        if (!$todo) {
            return response()->json(['message' => 'Todo not found'], 404);
        }

        $todo->delete();

        return response()->json(['message' => 'Todo deleted successfully']);
    }
}
