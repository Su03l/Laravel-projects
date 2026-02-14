<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskCommentController extends Controller
{
    public function store(Request $request, Task $task)
    {
        $request->validate(['content' => 'required|string']);

        $task->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $request->content
        ]);

        // ⚡ نسجل نشاط أيضاً!
        $task->activities()->create([
            'user_id' => $request->user()->id,
            'description' => 'commented on this task'
        ]);

        return back();
    }
}
