<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\ClassroomUser;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Http\Request;

class ClassroomController extends Controller
{

    public function handleErrorNotDefine($th)
    {
        return response()->json([
            'message' => "Đã xảy ra lỗi không xác định",
            'error' => env('APP_DEBUG') ? $th->getMessage() : "Lỗi không xác định"
        ], 500);
    }


    public function classrooms()
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

            if (!$student_code || !$student) {
                return response()->json("Bạn không có quyền truy cập!");
            }
            $classroom_codes = $student->classrooms->pluck('pivot.class_code');
            $classrooms = Classroom::with(['subject' => function($query){
                $query->select('subject_code', 'subject_name');
            }])
            ->whereIn('class_code', $classroom_codes)->select('class_code', 'class_name', 'subject_code')->get();
            return response()->json($classrooms);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }

    public function schedulesOfClassroom(string $class_code){

        $student_code = request()->user()->user_code;

        if(!$student_code){
            return response()->json([
                'status' => false,
                'message' => "Bạn không có quyền truy cập"
            ], 403);
        }

        // $classroom_user = ClassroomUser::where()
        $classroom = Classroom::firstWhere([
            'class_code' => $class_code
        ]);



        $schedules = Schedule::where('class_code', $classroom->class_code)->get();
        return response()->json($schedules);
    }

}
