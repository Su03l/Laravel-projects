<?php

namespace App\Http\Requests\V1\Tasks;

use Illuminate\Foundation\Http\FormRequest;


/**
 * @property \Illuminate\Http\UploadedFile|null $image
 */
class StoreTaskRequest extends FormRequest
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
            'project_id' => ['required', 'integer', 'exists:projects,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'priority' => ['nullable', 'in:low,medium,high'],
            'status' => ['nullable', 'in:todo,in_progress,done'],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
            'image' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:2048'],];
    }
}
