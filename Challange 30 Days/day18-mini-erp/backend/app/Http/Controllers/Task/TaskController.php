<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    use ApiResponse;

    // إضافة مهمة جديدة
    public function store(Request $request)
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'name' => 'required|string',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
            'priority' => 'in:low,medium,high'
        ]);

        $task = Task::create($data);
        return $this->success($task, 'تم إضافة المهمة', 201);
    }

    // تحديث حالة المهمة (الموظف خلص شغله)
    public function updateStatus(Request $request, Task $task)
    {
        $request->validate(['status' => 'required|in:pending,in_progress,completed']);

        $task->update(['status' => $request->status]);

        return $this->success($task, 'تم تحديث حالة المهمة');
    }
}
