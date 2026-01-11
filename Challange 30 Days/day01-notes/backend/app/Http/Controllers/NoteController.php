<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index()
    {
        return Note::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|min:3|max:255',
            'content' => 'required|string|max:1024'
        ]);

        $note = Note::create($data);

        return response()->json([
            'message' => 'Note created successfully',
            'note' => $note
        ], 201);
    }

    public function show($id)
    {
        return Note::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $note = Note::findOrFail($id);

        $data = $request->validate([
            'title' => 'required|string|min:3|max:255',
            'content' => 'required|string|max:1024'
        ]);

        $note->update($data);

        return response()->json([
            'message' => 'Note updated successfully',
            'note' => $note
        ]);
    }

    public function destroy($id)
    {
        $note = Note::findOrFail($id);

        $note->delete();

        return response()->json([
            'message' => 'Note deleted successfully'
        ]);
    }
}
