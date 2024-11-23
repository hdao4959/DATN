<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\User;
use App\Models\ClassroomUser;


class ClassroomController extends Controller
{


    public function handleErrorNotDefine($th)
    {
        return response()->json([
            'status' => false,
            'message' => "Đã xảy ra lỗi không xác định",
            'error' => env('APP_DEBUG') ? $th->getMessage() : "Lỗi không xác định"
        ], 500);
    }

    public function handleInvalidId()
    {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy lớp học này!',
        ], 404);
    }


    public function index()
    {
        try {
            $student_code = request()->user()->user_code;
            $student = User::with([
                'classrooms' => function ($query) {
                    $query->select('id');
                }
            ])->where([
                'is_active' => true,
                'user_code' => $student_code
            ])->first();

            if (!$student) {
                return response()->json("Bạn không có quyền truy cập!");
            }
            $classroom_codes = $student->classrooms->pluck('pivot.class_code');
            $classrooms = Classroom::with(['subject' => function ($query) {
                $query->select('subject_code', 'subject_name');
            }])
                ->whereIn('class_code', $classroom_codes)->select('class_code', 'class_name', 'subject_code')->get();
            return response()->json($classrooms);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }


    public function show(string $class_code)
    {
        try {
            $student_code = request()->user()->user_code;

            $classroom_user = ClassroomUser::with([
                'classroom' => function ($query) {
                    $query->select('class_code', 'class_name', 'is_active', 'subject_code', 'user_code');
                },
                'classroom.subject' => function ($query) {
                    $query->select('subject_code', 'subject_name');
                },
                'classroom.teacher' => function ($query) {
                    $query->select('user_code', 'full_name', 'email', 'major_code');
                },
                'classroom.teacher.major' => function ($query) {
                    $query->select('cate_code', 'cate_name');
                }
            ])->where([
                'user_code' => $student_code,
                'class_code' => $class_code
            ])->first();

            if (!$classroom_user) {
                return $this->handleInvalidId();
            }

            $classroom = $classroom_user->classroom->first();

            if (!$classroom) {
                return $this->handleInvalidId();
            }


            return response()->json($classroom, 200);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }

}
