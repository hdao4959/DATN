<?php

namespace App\Http\Requests\Classroom;

use Illuminate\Foundation\Http\FormRequest;

class StoreClassroomRequest  extends FormRequest
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
            'class_code' => 'required|unique:classrooms,class_code',
            'class_name' => 'required|unique:classrooms,class_name',
            'subject_code' => 'required',
            'section' => 'required',
            // 'description' => 'nullable',
            // 'date_to' => 'nullable',
            // 'students' => 'nullable',
            'study_days' => 'required',
            'date_from' => 'required|date|after_or_equal:today',
            'room_code' => 'required',
            // 'user_code' => 'nullable',
        ];
    }

    public function messages(){
        return [
            'class_code.required' => 'Bạn chưa nhập mã lớp học!',
            'class_code.unique' => 'Mã lớp học này đã tồn tại!',
            'class_name.required' => 'Bạn chưa nhập tên lớp học!',
            'class_name.unique' => 'Tên lớp học này đã tồn tại!',
            'section' => 'Bạn chưa chọn ca học!',
            'study_days.required' => "Bạn chưa chọn các ngày học trong tuần!",
            // 'description.required' => 'Bạn chưa nhập mô tả lớp học',
            'date_from.required' => 'Bạn chưa nhập ngày bắt đầu!',
            'date_from.date' => 'Ngày bắt đầu không hợp lệ!',
            'date_from.after_or_equal' => 'Ngày bắt đầu phải ở tương lai!',
            // 'date_to.required' => 'Bạn chưa nhập ngày kết thúc',
            // 'students.required' => 'Bạn chưa nhập danh sách sinh viên',
            'room_code.required' => 'Bạn chưa chọn phòng học!',
            'subject_code.required' => 'Bạn chưa chọn môn học!',
            // 'user_code.required' => 'Bạn chưa chọn giảng viên',
        ];
    }

    protected $stopOnFirstFailure = true;
}
