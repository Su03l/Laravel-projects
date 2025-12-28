<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'body' => 'required|string',
            'type' => 'required|in:project,task',
            'id' => 'required|integer'
        ]);

        $model = match ($request->type) {
            'project' => Project::findOrFail($request->id),
            'task' => Task::findOrFail($request->id),
        };

        $note = $model->notes()->create([
            'body' => $request->body
        ]);

        return response()->json([
            'message' => 'تم إضافة الملاحظة بنجاح ',
            'data' => $note
        ], 201);
    }

    public function update(Request $request, Note $note)
    {
        $request->validate([
            'body' => 'required|string'
        ]);

        $note->update(['body' => $request->body]);

        return response()->json([
            'message' => 'تم تعديل الملاحظة',
            'data' => $note
        ]);
    }

    public function destroy(Note $note)
    {
        $note->delete();
        return response()->json([
            'message' => 'تم حذف الملاحظة ️'
        ]);
    }
}
