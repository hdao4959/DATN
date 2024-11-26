<?php

namespace App\Http\Controllers\Student;

use App\Models\ClassroomUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\Schedule\HandleTransferSchedule;
use App\Http\Requests\Schedule\ShowListScheduleCanBeTransfer;
use App\Models\Classroom;
use App\Models\Schedule;
use App\Models\TransferScheduleHistory;
use App\Models\TransferScheduleTimeframe;
use DateTime;
use Illuminate\Support\Facades\DB;

class ScheduleController extends Controller
{



    public function handleErrorNotDefine($th)
    {
        return response()->json([
            'message' => "Đã xảy ra lỗi không xác định",
            'error' => env('APP_DEBUG') ? $th->getMessage() : "Lỗi không xác định"
        ], 500);
    }

    // public function handleInvalidId(){
    //     return response()->json([
    //         'status' => false,
    //         'message' => 'Lớp học này không tồn tại!'
    //     ],404);
    // }

    public function sliceClassname(string $class_name)
    {
        return strstr($class_name, '.', true);
    }


    public function index()
    {
        try {

            $student_code = request()->user()->user_code;

            $classroom_codes = ClassroomUser::where('user_code', $student_code)->pluck('class_code');

            if (!$classroom_codes) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không có lớp học nào'
                ], 200);
            }

            $schedules = Schedule::whereIn('class_code', $classroom_codes)
                ->where('date', '>=', now()->toDateString())
                ->get();

            return response()->json($schedules, 200);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }

    public function schedulesOfClassroom(string $class_code)
    {

        $student_code = request()->user()->user_code;

        $classroom = Classroom::whereHas('users', function ($query) use ($student_code) {
            $query->where('users.user_code', $student_code);
        })->firstWhere([
            'class_code' => $class_code
        ]);

        if (!$classroom) {
            return response()->json([
                'status' => false,
                'message' => 'Bạn không có quyền truy cập!'
            ], 403);
        }

        $schedules = Schedule::where('class_code', $classroom->class_code)->get();
        return response()->json($schedules, 200);
    }



    public function transferSchedules()
    {
        try {
            $student_code = request()->user()->user_code;
            // Lấy khoảng thời gian có thể đổi lịch
            $timeFrame = TransferScheduleTimeframe::select('start_time', 'end_time')->first();
            // Lấy thời gian hiện tại
            $now = now()->toDateTimeString();

            // Kiểm tra xem thời gian hiện tại có đủ điều kiện để đổi lịch không
            if($now <= $timeFrame->start_time || $now >= $timeFrame->end_time){
                $start_date_time = new DateTime($timeFrame->start_time);
                $end_date_time = new DateTime($timeFrame->start_time);

                $start_date = $start_date_time->format('d/m/Y');
                $start_time = $start_date_time->format('H:i');
                $end_date = $end_date_time->format('d/m/Y');
                $end_time = $end_date_time->format('H:i');

                return response()->json('Thời gian đổi lịch từ ' 
                . $start_time .' ngày '. $start_date . ' đến ' . $end_time . ', ngày ' . $end_date .  '!');
            }


            $class_code_transfered = TransferScheduleHistory::where('student_code', $student_code)->pluck('to_class_code');


            // Lấy ra các mã lớp học sẽ học của sinh viên
            $classroom_codes  = ClassroomUser::whereNotIn('class_code', $class_code_transfered)
            ->where('user_code', $student_code)->pluck('class_code');

            // Lấy thông tin các lớp học và số lượng học sinh hiện tại của lớp đó
            $classrooms = Classroom::select('class_code', 'class_name', 'subject_code')->withCount('users')->with([
                'subject:subject_code,subject_name',
                'schedules' => function ($query) {
                    $query->orderBy('date', 'asc')->limit(7);
                }
            ])->whereIn('class_code', $classroom_codes)->get();
            
            $classrooms_info_response = [];

            foreach ($classrooms as $class) {

                $study_days = [];
                // Lấy ra 7 ngày đầu tiêu của từng lớp học để lấy các thứ học trong tuần
                foreach ($class->schedules->pluck('date') as $date) {
                    $day = (new DateTime($date))->format('l');
                    if (!in_array($day, $study_days)) {
                        $study_days[] = $day;
                    }
                }

                $schedule = $class->schedules->first();

                if(!$schedule){
                    continue;
                }

                $session = $schedule->session;
                if(!$session){
                    continue;
                }

                $session_code = $session->cate_code;
                $session_name = $session->cate_name;

                if(!$session_code || !$session_name){
                    continue;
                }
                $classrooms_info_response[] = [
                    'class_code' => $class->class_code,
                    'class_name' => $class->class_name,
                    'subject_code' => $class->subject->subject_code,
                    'subject_name' => $class->subject->subject_name,
                    'users_count' => $class->users_count,
                    'room_slot' => $class->schedules->first()->room->value,
                    'session_code' => $session_code,
                    'session_name' => $session_name,
                    'study_days' => $study_days,
                    'date_from' => $class->schedules->first()->date
                ];
            }
            return response()->json($classrooms_info_response);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }

    public function listSchedulesCanBeTransfer(ShowListScheduleCanBeTransfer $request)
    {
        try {
            $student = request()->user();

              // Lấy khoảng thời gian có thể đổi lịch
              $timeFrame = TransferScheduleTimeframe::select('start_time', 'end_time')->first();

              // Lấy thời gian hiện tại
              $now = now()->toDateTimeString();
              // Kiểm tra xem thời gian hiện tại có đủ điều kiện để đổi lịch không
              if($now <= $timeFrame->start_time || $now >= $timeFrame->end_time){
                  return response()->json([
                    'status' => false,
                    'message' => 'Đã hết thời gian đổi lịch học!'
                  ],422);
              }

            $data = $request->validated();

            // Trường hợp khoá học hiện tại của học sinh khác khoá học của lớp học hiện tại
            if ($student->course_code !== $data['course_code']) {
                return response()->json(
                    [
                        'status' => false,
                        'message' => 'Khoá học không hợp lệ!'
                    ]
                );
            }
            // Kiểm tra lớp học hiện tại có tồn tại hay không!
            $classroom = Classroom::join('classroom_user', 'classroom_user.class_code', 'classrooms.class_code')->where('classrooms.class_code', $data['class_code'])
            ->where('classroom_user.user_code', $student->user_code)
            ->first();
            

            if(!$classroom || $classroom->user_code != $student->user_code){
                return response()->json([
                    'status' => false,
                    'message' => 'Lớp học hiện tại không tồn tại!'
                ],404);
            }

            // Cắt tên lớp học hiện tại và chỉ lấy chuỗi trước dấu '.'
            $class_name_pattern = $this->sliceClassname($classroom->class_code);


            // Tìm các lớp học có Ca học Được yêu cầu + không phải lớp học hiện tại + các lớp học có cùng mã khoá học và mã môn học
            $classrooms_can_be_transfer = Classroom::withCount('users')
                ->with([
                    'subject' => function ($query) {
                        $query->select('subject_code', 'subject_name');
                    },
                    'schedules' => function ($query) {
                        $query->with(['session', 'room'])->orderBy('date', 'asc')->limit(7);
                    }
                ])->whereHas('schedules', function($query) use ($data){
                    $query->whereHas('session', function($sessionQuery) use ($data){
                        $sessionQuery->where('cate_code', $data['session_code']);
                    })->whereHas('room', function($roomQuery){
                        $roomQuery->whereRaw('CAST(value AS SIGNED) > (SELECT COUNT(*) from classroom_user where classroom_user.class_code = schedules.class_code)');
                    });
                })
                ->where('class_code', 'LIKE', $class_name_pattern . '%')
                ->where('class_code', '!=', $classroom->class_code)
                ->get();
                
                // ->makeHidden(['score', 'description', 'is_active', 'user_code', 'deleted_at', 'created_at', 'updated_at'])
                // return response()->json($classrooms_can_be_transfer);
                
        
            // Trường hợp không có lớp học nào để đổi
            if ($classrooms_can_be_transfer->count() === 0) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không có lớp học nào để đổi!'
                ]);
            }
            // return response()->json($classrooms_can_be_transfer->count());
            // XỬ lí dữ liệu để trả về
            $classrooms_info_response = [];
            foreach ($classrooms_can_be_transfer as $class) {

                $days = [];

                foreach ($class->schedules->pluck('date') as $date) {

                    $day = (new DateTime($date))->format('l');

                    if (!in_array($day, $days)) {
                        $days[] = $day;
                    }
                }
                $schedule = $class->schedules->first();
                if(!$schedule){
                    continue;
                }


                $room_code = $schedule->room->cate_code;
                $session_code = $schedule->session->cate_code;

                if (!$room_code || !$session_code) {
                    continue; 
                }

                $room_name = $schedule->room->cate_name;
                $room_slot = $schedule->room->value;
                $session_name = $schedule->session->cate_name;

            if(!$room_name || !$room_slot || !$session_name){
                continue;
            }

                $classrooms_info_response[] = [
                    'class_code' => $class->class_code,
                    'class_name' => $class->class_name,
                    'subject_code' => $class->subject->subject_code,
                    'subject_name' => $class->subject->subject_name,
                    'session_code' => $session_code,
                    'session_name' => $session_name,
                    'users_count' => $class->users_count,
                    'room_code' => $room_code,
                    'room_name' => $room_name,
                    'room_slot' => $room_slot,
                    'study_days' => $days
                ];
            }

            return response()->json($classrooms_info_response);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }


    public function handleTransferSchedule(HandleTransferSchedule $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            $timeFrame = TransferScheduleTimeframe::select('start_time', 'end_time')->first();

            // Lấy thời gian hiện tại
            $now = now()->toDateTimeString();
            // Kiểm tra xem thời gian hiện tại có đủ điều kiện để đổi lịch không
            if($now <= $timeFrame->start_time || $now >= $timeFrame->end_time){
                return response()->json([
                  'status' => false,
                  'message' => 'Đã hết thời gian đổi lịch học!'
                ],422);
            }


            $student = request()->user();
            $student_code = $student->user_code;
            


            if ($student->course_code !== $data['course_code']) {
                return response()->json(
                    [
                        'status' => false,
                        'message' => 'Khoá học không hợp lệ!'
                    ]
                );
            }

            // Trường hợp mã lớp học hiện tại = lớp học muốn chuyển đến 
            if ($data['class_code_current'] == $data['class_code_target']) {
                return response()->json([
                    'status' => false,
                    'message' => 'Bạn đang học tại lớp học này rồi!'
                ], 403);
            }

            // Kiểm tra xem học sinh này hiện tại có học trong lớp học có mã lớp được gửi lên hay không?
            $classroom_current = Classroom::join('classroom_user', 'classrooms.class_code', '=', 'classroom_user.class_code')
                ->where('classroom_user.user_code', $student_code)
                ->where('classroom_user.class_code', $data['class_code_current'])
                ->lockForUpdate()->first();

            if (!$classroom_current) {
                return response()->json([
                    'status' => false,
                    'message' => 'Bạn không thuộc lớp học này!'
                ], 404);
            }
            

            $class_code_transfered = TransferScheduleHistory::where([
                'student_code' => $student_code, 
                'to_class_code' => $classroom_current->class_code
            ])->exists();

            if($class_code_transfered){
                return response()->json([
                    'status' => false,
                    'message' => 'Bạn không thể đổi lịch với môn học này nữa!'
                ],422);
            }

            // Kiểm tra xem lớp học mục tiêu có tồn tại không?
            $classroom_target = Classroom::withCount('users')->with(
                [
                    'schedules' => function ($query) {
                        $query->limit(7);
                    }
                ]
            )->where('class_code', $data['class_code_target'])->lockForUpdate()->first();
            
            if (!$classroom_target) {
                return response()->json([
                    'status' => false,
                    'message' => 'Lớp học bạn muốn đổi không tồn tại!'
                ], 404);
            }


            // Kiểm tra môn học của lớp có trùng nhau không 
            if ($this->sliceClassname($classroom_current->class_code) !== $this->sliceClassname($classroom_target->class_code)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Môn học hoặc khoá học giữa 2 lớp không trùng khớp!'
                ],403);
            }

            $schedule = $classroom_target->schedules->first();
            if(!$schedule || !$schedule->room){
                return response()->json([
                    'status' => false,
                    'message' => 'Lịch học hoặc phòng học của lớp học không xác định!'
                ],404);
            }

            // Lấy sức chứa tối đa của lớp học
            $classroom_target_capacity = $schedule->room->value ;
            // Lấy số lượng sinh viên hiện tại của lớp học
            $classroom_target_current_capacity = $classroom_target->users_count;

            // Trường hợp số lượng sinh viên hiện tại >= sức chứa tối đa của lớp học
            if ($classroom_target_current_capacity >= $classroom_target_capacity) {
                return response()->json(
                    [
                        'status' => false,
                        'message' => 'Lớp học này đã đầy'
                    ],403
                );
            }

            $classroom_current->users()->detach($student_code);
            $classroom_target->users()->attach($student_code);
            TransferScheduleHistory::create([
                'student_code' => $student_code,
                'from_class_code' => $classroom_current->class_code,
                'to_class_code' => $classroom_target->class_code,
            ]);

            DB::commit();
            return response()->json([
                'status' => true,
                'message' => 'Đổi lịch học thành công!'
            ], 201);
        } catch (\Throwable $th) {
            DB::rollback();
            return $this->handleErrorNotDefine($th);
        }
    }
}
