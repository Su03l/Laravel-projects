<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // this for inject task service
    public function __construct(protected TaskService $taskService)
    {
    }

    // this for create task
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'task_column_id' => 'required|exists:task_columns,id',
            'title' => 'required|string|max:255',
        ]);

        // نضع المهمة الجديدة في آخر القائمة
        $maxPosition = Task::where('task_column_id', $validated['task_column_id'])->max('position') ?? 0;

        Task::create([
            ...$validated,
            'position' => $maxPosition + 1
        ]);

        return redirect()->back(); // Inertia will update the props automatically
    }

    // this for update task
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'sometimes|in:low,medium,high',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);

        // تسجيل نشاط إذا تغيرت الحالة أو المسؤول (اختياري، يمكن إضافته لاحقاً)

        return back();
    }

    // this for move task
    public function move(Request $request, Task $task)
    {
        $validated = $request->validate([
            'column_id' => 'required|exists:task_columns,id',
            'position' => 'required|integer|min:0'
        ]);

        // استدعاء الخدمة السحرية 🪄
        $this->taskService->moveTask(
            $task,
            $validated['column_id'],
            $validated['position']
        );

        return redirect()->back();
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return back(); // Inertia will refresh the board
    }
}
