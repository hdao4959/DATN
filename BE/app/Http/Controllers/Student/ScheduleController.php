<?php

namespace App\Http\Controllers\Student;

use Throwable;
use Illuminate\Http\Request;
use App\Models\ClassroomUser;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class ScheduleController extends Controller
{
    public function index(Request $request){
        try {
            $userCode = $request->user()->user_code;
            // $userCode = 'student04';

            $schedules = ClassroomUser::where('user_code', $userCode)
                        ->with(['classroom' => function ($query) {
                            $query->select('class_code', 'class_name', 'subject_code', 'user_code');

                        }, 'classroom.subject' => function ($query) {
                            $query->select('subject_code', 'subject_name', 'semester_code');

                        }, 'classroom.teacher' => function ($query) {
                            $query->select('user_code', 'full_name');

                        }, 'classroom.schedules' => function ($query) {
                            
                        }])
                        ->get(['class_code', 'user_code'])
                        ->map(function ($schedule) {
                            $classroom = $schedule->classroom->first(); // Giả sử chỉ có 1 lớp trong mỗi ClassroomUser
                            $result = [];
                    
                            // Lặp qua tất cả lịch học của lớp
                            foreach ($classroom->schedules as $classSchedule) {
                                // Giải mã giá trị session
                                $sessionValue = optional($classSchedule->session)->value ?? '{}';
                                $sessionValue = json_decode($sessionValue, true);
                    
                                $result[] = [
                                    'classroom' => [
                                        'class_code' => $classroom->class_code ?? null,
                                        'class_name' => $classroom->class_name ?? null,
                                    ],
                                    'subject' => [
                                        'subject_code' => optional($classroom->subject)->subject_code ?? null,
                                        'subject_name' => optional($classroom->subject)->subject_name ?? null,
                                    ],
                                    'teacher' => [
                                        'user_code' => optional($classroom->teacher)->user_code ?? null,
                                        'full_name' => optional($classroom->teacher)->full_name ?? null,
                                    ],
                                    'schedules' => [
                                        'date' => $classSchedule->date ?? null,
                                        'room_code' => optional($classSchedule->room)->cate_name ?? null,
                                        'session_code' => optional($classSchedule->session)->session_code ?? null,
                                        'start_time' => $sessionValue['start'] ?? null,
                                        'end_time' => $sessionValue['end'] ?? null,
                                    ],
                                ];
                            }
                    
                            return $result;
                        })
                        ->flatten(1); // Làm phẳng mảng, nếu có nhiều lớp thì sẽ kết hợp tất cả các lịch học vào một mảng
            return response()->json($schedules,200);
        } catch (Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định!'
            ], 500);
        }
    }
}
