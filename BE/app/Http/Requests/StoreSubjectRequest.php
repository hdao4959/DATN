<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'subject_code' => 'required|string|max:255',
            'subject_name' => 'required|string|max:255',
            'tuition' => 'required|numeric',
            're_study_fee' => 'required|numeric',
            'credit_number' => 'required|integer',
            'number_study' => 'required|integer',
            'exam_day' => 'required|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
            'is_delete' => 'boolean',
            'semester_code' => 'required|string|max:255',
            'major_code' => 'required|string|max:255',
            'narrow_major_code' => 'required|string|max:255',
        ];
    }
}
