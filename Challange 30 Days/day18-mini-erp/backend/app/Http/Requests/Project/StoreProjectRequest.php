<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'client_id' => 'required|exists:clients,id', // لازم العميل يكون مسجل
            'manager_id' => 'required|exists:users,id',   // لازم المدير يكون يوزر موجود
            'budget' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'deadline' => 'required|date|after:start_date', // الموعد النهائي لازم يكون بعد البداية
            'description' => 'nullable|string',
            'status' => 'in:pending,active,completed,hold'
        ];
    }
}
