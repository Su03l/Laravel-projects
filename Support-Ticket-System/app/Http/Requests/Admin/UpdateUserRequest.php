<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{

    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $this->route('user')->id, // استثناء اليوزر الحالي
            'password' => 'nullable|string|min:8|confirmed', // اختياري
            'role' => 'sometimes|in:admin,user',
        ];
    }
}
