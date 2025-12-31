<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // 1. عرض المهام (حسب الصلاحية)
    public function index(Request $request)
    {
        $user = $request->user();

        // لو كان أدمن: جيب كل المهام في النظام مع أسماء أصحابها
        if ($user->role === 'admin') {
            $tasks = Task::with('user:id,name')->latest()->get();
            return response()->json([
                'message' => 'أهلاً أيها المدير ',
                'data' => $tasks
            ]);
        }

        // لو موظف عادي: جيب مهامه هو فقط
        $tasks = $user->tasks()->latest()->get();
        return response()->json([
            'message' => 'أهلاً بك، هذه مهامك ',
            'data' => $tasks
        ]);
    }

    // 2. إنشاء مهمة جديدة
    public function store(Request $request)
    {
        $fields = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'status' => 'in:pending,completed'
        ]);

        $task = $request->user()->tasks()->create($fields);

        return response()->json([
            'message' => 'تم إنشاء المهمة',
            'data' => $task
        ]);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $this->authorize('update', $task);

        $task->update($request->all());

        return response()->json([
            'message' => 'تم التحديث ',
            'data' => $task
        ]);
    }

    // تعديل دالة الحذف
    public function destroy($id)
    {
        $task = Task::findOrFail($id);

        $this->authorize('delete', $task);

        $task->delete();

        return response()->json([
            'message' => 'تم الحذف ️'
        ]);
    }


}
