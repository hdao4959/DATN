<?php

namespace App\Http\Requests\Classroom;

use Illuminate\Foundation\Http\FormRequest;

class HandleStep1 extends FormRequest
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
            'class_name' => 'required',
            'course_code' => 'required|exists:categories,cate_code',
            'major_code' => 'required|exists:categories,cate_code',
            'subject_code' => 'required|exists:subjects,subject_code',
            
            'study_days' => 'required|array',
            'study_days.*' => 'in:1,2,3,4,5,6,7',
            'date_from' => 'required|date|after_or_equal:tomorrow',
        ];
    }
}
