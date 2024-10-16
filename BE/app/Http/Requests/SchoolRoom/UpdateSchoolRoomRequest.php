<?php

namespace App\Http\Requests\SchoolRoom;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateSchoolRoomRequest extends FormRequest
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
        $id = $this->route('id');
        return [
            'cate_code' => 'required|unique:categories,id' . $id . ',id',
            'cate_name' => 'required|max:255|regex:/^[^<>{}]*$/',
            'value' => 'regex:/^[^<>{}]*$/',
            'image' => 'image|mimes:jpeg,png,jpg,gif,svg',
            'description' => 'regex:/^[^<>{}]*$/',
        ];
    }

    public function messages(){
        return [
            'cate_code.required' => 'Bạn chưa nhập mã phòng học',
            'cate_code.unique' => 'Mã phòng học đã được sử dụng',
            'cate_name.required' => 'Bạn chưa nhập tên phòng học',
            'cate_name.max' => 'Tên phòng học không quá 255 kí tự',
            'cate_name.regex' => 'Tên phòng học không chứa kí tự đặc biệt',
            'value.regex' => 'Giá trị không chứa kí tự đặc biệt',
            'image.image' => 'File phải là ảnh',
            'image.mimes' => 'File ảnh phải có định dạng jpeg, png, jpg, gif, hoặc svg.',
            'description.regex' => 'Mô tả không chứa kí tự đặc biệt'
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();

        $response = response()->json([
            'errors' => $errors->messages()
        ], 400);

        throw new HttpResponseException($response);
    }
}
