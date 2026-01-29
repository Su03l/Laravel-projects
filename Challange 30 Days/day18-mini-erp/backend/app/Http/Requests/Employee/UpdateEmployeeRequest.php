<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
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
        // نجيب آيدي اليوزر المرتبط بهذا الموظف عشان نتجاهله في فحص الايميل
        // $this->route('employee') بيرجع لنا مودل الموظف
        $userId = $this->route('employee')->user_id;

        return [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $userId,
            'password' => 'nullable|string|min:6',
            'role' => 'sometimes|in:admin,hr,employee',

            'department_id' => 'sometimes|exists:departments,id',
            'job_title' => 'sometimes|string',
            'salary' => 'sometimes|numeric|min:0',
            'joining_date' => 'sometimes|date',
        ];
    }
}
