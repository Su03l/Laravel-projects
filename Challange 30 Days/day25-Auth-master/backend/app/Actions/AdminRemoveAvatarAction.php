<?php

namespace App\Actions;

use App\Models\User;
use Illuminate\Support\Facades\Storage;

class AdminRemoveAvatarAction
{
    public function execute(User $user): void
    {
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar); // حذف الملف الفعلي
            $user->update(['avatar' => null]); // تصفير العمود في الداتابيس
        }
    }
}
