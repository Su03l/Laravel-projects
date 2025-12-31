<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin'; // المدير فقط
    }

    // 2. عرض ملف مستخدم معين (Show)
    public function view(User $user, User $model): bool
    {
        // المدير، أو صاحب الحساب نفسه
        return $user->role === 'admin' || $user->id === $model->id;
    }

    // 3. تحديث البيانات (Update)
    public function update(User $user, User $model): bool
    {
        return $user->role === 'admin' || $user->id === $model->id;
    }

    // 4. حذف المستخدم (Delete)
    public function delete(User $user, User $model): bool
    {
        return $user->role === 'admin'; // المدير فقط هو من يفصل الموظفين
    }
}
