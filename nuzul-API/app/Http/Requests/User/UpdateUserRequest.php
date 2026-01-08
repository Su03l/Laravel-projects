<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes', 'email',
                Rule::unique('users', 'email')->ignore($this->user()->id)
            ],
            'phone' => [
                'sometimes', 'numeric', 'digits:10',
                Rule::unique('users', 'phone')->ignore($this->user()->id)
            ],
            'avatar' => 'nullable|url',
            'bio' => 'nullable|string|max:500',
            'city' => 'nullable|string',
        ];
    }
}
