<?php

namespace App\Http\Controllers;

use App\Models\TaskColumn;
use Illuminate\Http\Request;

class TaskColumnController extends Controller
{
    // this for create column
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'name' => 'required|string|max:255',
        ]);

        $maxPosition = TaskColumn::where('project_id', $validated['project_id'])->max('position') ?? -1;

        TaskColumn::create([
            ...$validated,
            'position' => $maxPosition + 1
        ]);

        return back();
    }

    // this for delete column
    public function destroy(TaskColumn $column)
    {
        if ($column->tasks()->exists()) {
            return back()->withErrors(['error' => 'Cannot delete column with tasks!']);
        }
        $column->delete();
        return back();
    }
}
