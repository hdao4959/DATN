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
            'subjectCode' => 'required|string|max:255',
            'subjectName' => 'required|string|max:255',
            'tuition' => 'required|numeric',
            'reStudyFee' => 'required|numeric',
            'creditNumber' => 'required|integer',
            'numberStudy' => 'required|integer',
            'examDay' => 'required|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:1000',
            'isActive' => 'required|boolean',
            'isDelete' => 'required|boolean',
            'semesterCode' => 'required|string|max:255',
            'majorCode' => 'required|string|max:255',
            'narrowMajorCode' => 'required|string|max:255',
        ];
    }
}
