<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Schedule\CreateTransferScheduleTimeframe;
use App\Models\Classroom;
use App\Models\ClassroomUser;
use App\Models\Schedule;
use App\Models\TransferScheduleTimeframe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

            $classroom = Classroom::with([
                'subject' => function($query){
                    $query->select('subject_code', 'subject_name');
                }
            ])->where('class_code', $class_code)->select('class_code', 'class_name', 'subject_code')->first();
            // return response()->json($classroom);
            if (!$classroom) {
                return response()->json(
                    [
                        'status' => false,
                        'message' => 'Lớp học không tồn tại!'
                    ],
                    404
                );
            }
            $schedules = $classroom->schedules;

            return response()->json($schedules, 200);
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


    public function transfer_schedule_timeframe()
    {
        try {
            $timeframe = TransferScheduleTimeframe::select('start_time', 'end_time')->first();
            
            return response()->json($timeframe);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }
    public function create_transfer_schedule_timeframe(CreateTransferScheduleTimeframe $request)
    {

        try {
            $data = $request->validated();

            if ($data['start_time'] >= $data['end_time']) {
                return response()->json(
                    [
                        'status' => false,
                        'message' => 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu!'
                    ],
                    403
                );
            }

            TransferScheduleTimeframe::updateOrCreate(
                [
                    'id' => 1
                ],
                [
                    'start_time' => $data['start_time'],
                    'end_time' => $data['end_time']
                ]
            );
            return response()->json([
                'status' => true,
                'message' => 'Đặt thời gian đổi lịch cho sinh viên thành công!'
            ]);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }
}
