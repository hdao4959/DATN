<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Schedule;

use App\Models\User;

use Carbon\Carbon;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function handleInvalidId()
    {
        return response()->json([
            'message' => 'Lớp học không tồn tại!',
        ], 404);
    }

    //  Hàm trả về json khi lỗi không xác định (500)
    public function handleErrorNotDefine($th)
    {
        return response()->json([
            'message' => "Đã xảy ra lỗi không xác định",
            'error' => env('APP_DEBUG') ? $th->getMessage() : "Lỗi không xác định"
        ], 500);
    }

    public function index(Request $request)
    {
        try {
            $today = Carbon::today();
            $sevenDaysLater = Carbon::today()->addDays(7);

            $userCode = $request->user_code;

            // $list_classroom_codes = Classroom::where([
            //     'user_code' =>  $userCode,
            //     'is_active' => true
            // ])
            // ->pluck('class_code');

            // $list_schedules = Schedule::with(['classroom','room','session'])
            // ->whereIn('class_code', $list_classroom_codes)
            // ->select('class_code', 'room_code' , 'session_code', 'date')
            // ->get();

            $list_schedules = Schedule::whereBetween('date',[$today, $sevenDaysLater])
                                ->where('type','study')
                                ->where('teacher_code',$userCode)
                                ->get();

            return response()->json($list_schedules,200);

        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }

    // public function show(Request $request, string $classCode)
    // {
    //     try {
    //         $userCode = $request->user()->user_code;

    //         $schedules = Classroom::where('user_code', $userCode)->where('class_code', $classCode)
    //             ->with(['schedules'])
    //             ->get()->flatMap(function ($classroom) {
    //                     return $classroom->schedules->map(function ($schedule) {
    //                         // Giải mã trường JSON `value` của `session`
    //                         $sessionValue = json_decode($schedule->session->value ?? '{}', true);
    //                     return [
    //                         'class_code' => $schedule->class_code,
    //                         'date' => $schedule->date,
    //                         'classroom' => [
    //                             'class_name' => $schedule->classroom->class_name ?? null,
    //                         ],
    //                         'room' => [
    //                             'cate_name' => $schedule->room->cate_name ?? null,
    //                         ],
    //                         'session' => [
    //                             'cate_code' => $schedule->session->cate_code ?? null,
    //                             'cate_name' => $schedule->session->cate_name ?? null,
    //                             'start_time' => $sessionValue['start'] ?? null,
    //                             'end_time' => $sessionValue['end'] ?? null,
    //                         ],
    //                     ];
    //                 });
    //             });
    //         if (!$schedules) {
    //             return $this->handleInvalidId();
    //         }
    //         return response()->json($schedules,200);
    //     } catch (\Throwable $th) {
    //         return $this->handleErrorNotDefine($th);
    //     }
    // }

    public function listSchedulesForClassroom(string $classcode){
        try{
            $teacher_code = request()->user()->user_code;
            $class_code = Classroom::where([
                'class_code' => $classcode,
                'user_code' => $teacher_code
            ])->pluck('class_code')->first();

            $list_schedules = Schedule::with(
               ['room',
               'session'])
            ->where('class_code', $class_code)
            ->select('class_code', 'room_code' , 'session_code', 'date')->get()->makeHidden(['class_code', 'room_code', 'session_code']);
                return response()->json($list_schedules,200);
        }
       catch(\Throwable $th){
            return $this->handleErrorNotDefine($th);
       }
    }

    public function listSchedulesForTeacher(Request $request){
        try{
            $teacher_code = $request->user_code;
            $now = Carbon::now();
            $sevenDaysLater = Carbon::now()->addDays(7);

            $list_schedules = Schedule::query()
                            ->where('user_code',$teacher_code)
                            ->whereBetween('date',[$now, $sevenDaysLater])
                            ->orderBy('date','asc')
                            ->get();
            return response()->json($list_schedules,200);
        }
       catch(\Throwable $th){
            return $this->handleErrorNotDefine($th);
       }
    }

    public function listSchedulesForStudent(Request $request){
        try{
            $student_code = $request->user_code;
            $student = User::where('user_code', $student_code)->first();

            if (!$student) {
                return response()->json(['error' => 'Student not found'], 404);
            }

            $list_schedules = $student->classrooms()
                            ->with('schedules')
                            ->get()
                            ->pluck('schedules')
                            ->flatten();
            return response()->json($list_schedules,200);
        }
       catch(\Throwable $th){
            return $this->handleErrorNotDefine($th);
       }
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
