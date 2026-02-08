<?php

namespace App\Actions;

use App\DTOs\UpdateProfileDTO;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class UpdateProfileAction
{
    public function execute(User $user, UpdateProfileDTO $data): User
    {
        $updateData = [];

        if ($data->name) $updateData['name'] = $data->name;
        if ($data->email) $updateData['email'] = $data->email;
        if ($data->phone) $updateData['phone'] = $data->phone;

        // Handle Avatar (Delete old, upload new)
        if ($data->avatar) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $updateData['avatar'] = $data->avatar->store('avatars', 'public');
        }

        $user->update($updateData);
        return $user;
    }
}
