<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    public function update(User $user, Task $task): bool
    {
        // مسموح إذا كان أدمن OR هو صاحب المهمة
        return $user->role === 'admin' || $user->id === $task->user_id;
    }

    // 2. من يحق له حذف المهمة؟
    public function delete(User $user, Task $task): bool
    {
        // مسموح للأدمن فقط
        return $user->role === 'admin';
    }
}
