<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\ClassroomUser;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{

    public function handleInvalidId()
    {
        return response()->json([
            'status' => false,
            'message' => 'Lớp học này không tồn tại!',
        ], 404);
    }

    //  Hàm trả về json khi lỗi không xác định (500)
    public function handleErrorNotDefine($th)
    {
        return response()->json([
            'status' => false,
            'message' => "Đã xảy ra lỗi không xác định",
            'error' => env('APP_DEBUG') ? $th->getMessage() : "Lỗi không xác định"
        ], 500);
    }


    public function schedulesOfClassroom(string $class_code)
    {
        try {

            $classroom = Classroom::with('schedules')->where('class_code', $class_code)->first();
            if(!$classroom){
                return response()->json(
                    [
                        'status' => false,
                        'message' => 'Lớp học không tồn tại!'
                    ],404
                    );
            }
            $schedules = $classroom->schedules;

            return response()->json($schedules,200);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }

    public function schedulesOfTeacher(string $teacher_code)
    {
        try {
            $classrooms = Classroom::with('schedules')->where('user_code', $teacher_code)->get();
            $class_codes = $classrooms->pluck('class_code');

            $schedules = Schedule::whereIn('class_code', $class_codes)->get();
            return response()->json($schedules);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }

    public function schedulesOfStudent(string $student_code)
    {
        try {
            $classrooms = ClassroomUser::where('user_code', $student_code);
            $classroom_codes = $classrooms->pluck('class_code');
            $schedules = Schedule::whereIn('class_code', $classroom_codes)->get();
            return response()->json($schedules);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }
}
