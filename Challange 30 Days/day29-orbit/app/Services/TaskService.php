<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Support\Facades\DB;

class TaskService
{
    /**
     * نقل مهمة من مكان لآخر (عمود مختلف أو نفس العمود)
     */
    public function moveTask(Task $task, int $newColumnId, int $newPositionIndex)
    {
        return DB::transaction(function () use ($task, $newColumnId, $newPositionIndex) {

            // 1. تحديث عمود المهمة
            $task->task_column_id = $newColumnId;
            $task->save();

            // 2. جلب جميع المهام في العمود المستهدف (مرتبة حالياً)
            // نستثني المهمة التي نحركها حالياً عشان ما تتكرر
            $tasksInColumn = Task::where('task_column_id', $newColumnId)
                ->where('id', '!=', $task->id)
                ->orderBy('position')
                ->get();

            // 3. إقحام المهمة في الترتيب الجديد (Array Splice logic)
            // المتغير $tasksInColumn هو Collection، نحوله لـ Array عشان نعدل عليه
            $tasksInColumn->splice($newPositionIndex, 0, [$task]);

            // 4. إعادة ترقيم الجميع (Re-indexing)
            // هذا يضمن أن الترتيب يكون دائماً نظيف: 0, 1, 2, 3...
            foreach ($tasksInColumn as $index => $t) {
                // تحديث فقط إذا تغير الرقم (لتحسين الأداء)
                if ($t->position != $index) {
                    $t->where('id', $t->id)->update(['position' => $index]);
                }
            }
        });
    }
}
