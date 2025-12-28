<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        return response()->json(Task::with('project')->get());
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'title' => 'required|string',
            'project_id' => 'required|exists:projects,id',
            'status' => 'in:pending,in_progress,done'
        ]);

        $task = Task::create($fields);
        return response()->json([
            'message' => 'تم إضافة المهمة ',
            'data' => $task
        ], 201);
    }

    public function show(Task $task)
    {
        return response()->json($task->load(['notes', 'attachments']));
    }

    public function update(Request $request, Task $task)
    {
        $task->update($request->all());
        return response()->json([
            'message' => 'تم تحديث المهمة ',
            'data' => $task
        ]);
    }
}
