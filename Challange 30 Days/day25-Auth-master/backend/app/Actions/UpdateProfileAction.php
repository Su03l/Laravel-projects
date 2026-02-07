<?php

namespace App\Actions;

use App\DTOs\UpdateProfileDTO;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class UpdateProfileAction
{
    public function execute(User $user, UpdateProfileDTO $data): User
    {
        $updateData = array_filter([
            'name' => $data->name,
            'phone' => $data->phone,
        ]);

        // معالجة الصورة
        if ($data->avatar) {
            // 1. حذف الصورة القديمة إذا وجدت
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            // 2. رفع الجديدة
            $path = $data->avatar->store('avatars', 'public');
            $updateData['avatar'] = $path;
        }

        $user->update($updateData);
        return $user;
    }
}
