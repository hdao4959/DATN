<?php

namespace App\Http\Requests\Classroom;

use Illuminate\Foundation\Http\FormRequest;

class RenderSchedulesForStoreClassroom extends FormRequest
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
            'session_code' => 'required|exists:categories,cate_code',
            'subject_code' => 'required|exists:subjects,subject_code',
            'date_from' => 'required|date|after_or_equal:tomorrow',
            'study_days' => 'required|array',
            'study_days.*' => 'in:1,2,3,4,5,6,7',
        ];
    }

    public function messages(){
        return [
            'session_code.required' => 'Bạn chưa chọn ca học!',
            'session_code.exists' => "Ca học này không tồn tại!",
            'date_from.required' => 'Bạn chưa chọn ngày bắt đầu của lớp học!',
            'date_from.date' => 'Định dạng ngày bắt đầu không hợp lệ!',
            'date_from.after_or_equal' => 'Ngày bắt đầu phải là ngày mai trở đi!',
            'study_days.required' => 'Bạn chưa chọn ngày học trong tuần!',
            'study_days.array' => 'Các ngày học không hợp lệ!',
            'study_days.*.in' => 'Các ngày học không hợp lệ!',
        ];
    }
}