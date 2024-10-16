<?php

namespace App\Http\Requests\Classroom;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClassRoomRequest extends FormRequest
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
            'id' => 'integer',
            'class_code' => 'required|unique:class_rooms,class_code,' . $this->route('classroom') . ',class_code',
            'class_name' => 'required|unique:class_rooms,class_name,' . $this->route('classroom') . ',class_code',
            'description' => 'required|regex:/^[^<>{}]*$/',
            'date_from' => 'required',
            'date_to' => 'required',
            'students' => 'required',
            'study_room_code' => 'required',
            'subject_code' => 'required',
            'user_code' => 'required',
        ];
    }

    public function messages(){
        return [
            'class_code.required' => 'Bạn chưa nhập mã lớp học',
            'class_code.unique' => 'Mã lớp học này đã tồn tại',
            'class_name.required' => 'Bạn chưa nhập tên lớp học',
            'class_name.unique' => 'Tên lớp học này đã tồn tại',
            'description.required' => 'Bạn chưa nhập mô tả lớp học',
            'description.regex' => 'Không chứa ký tự đặc biệt',
            'date_from.required' => 'Bạn chưa nhập ngày bắt đầu',
            'date_to.required' => 'Bạn chưa nhập ngày kết thúc',
            'students.required' => 'Bạn chưa nhập danh sách sinh viên',
            'study_room_code.required' => 'Bạn chưa nhập mã phòng học',
            'subject_code.required' => 'Bạn chưa nhập mã môn học',
            'user_code.required' => 'Bạn chưa chọn giảng viên',
        ];
    }

    protected $stopOnFirstFailure = true;

}
