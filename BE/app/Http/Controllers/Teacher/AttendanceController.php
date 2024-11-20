<?php

namespace App\Http\Controllers\Teacher;

use Throwable;
use Carbon\Carbon;
use App\Models\Schedule;
use App\Models\Classroom;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\Attendance\StoreAttendanceRequest;
use App\Http\Requests\Attendance\UpdateAttendanceRequest;

class AttendanceController extends Controller
{
    // Hàm trả về json khi id không hợp lệ
    public function handleInvalidId()
    {

        return response()->json([
            'message' => 'Không có attendance nào!',
        ], 200);
    }

    //  Hàm trả về json khi lỗi không xác định (500)
    public function handleErrorNotDefine($th)
    {
        Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

        return response()->json([
            'message' => 'Lỗi không xác định!'
        ], 500);
    }
    //  Hàm trả về thời gian bắt đầu ca học
    public function startTime($classCode)
    {
        $sessions = Schedule::where('class_code', $classCode)
                            ->with('session')
                            ->get()
                            ->map(function ($session) {
                                return [
                                    'session' => $session->session ? $session->session->value : null
                                ];
                            });
        $sessionData = json_decode($sessions[0]['session'], true);
        $start = $sessionData['start'] ?? null;
        return $start;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $teacher_code = $request->user()->user_code;
            $classCode = $request->input('search');
            $classrooms = Classroom::query()
                                    ->where('user_code', $teacher_code)
                                    ->when($classCode, function ($query, $classCode) {
                                        return $query
                                                ->where('class_code', 'like', "%{$classCode}%");
                                    })
                                    ->paginate(4);
            if ($classrooms->isEmpty()) {

                return $this->handleInvalidId();
            }

            return response()->json($classrooms, 200);
        } catch (Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceRequest $request, string $classCode)
    {
        try {
            $attendances = $request->validated();
            // Log::info('Request Data:', $request->all());
            $startTime = Carbon::createFromFormat('H:i', $this->startTime($classCode));
            $currentTime = Carbon::now();

            if ($currentTime->diffInMinutes($startTime) <= 15) {
                // Kiểm tra nếu dữ liệu là mảng và có dữ liệu
                if (is_array($attendances) && count($attendances) > 0) {
                    foreach ($attendances as $atd) {
                        Attendance::create([
                            'student_code' => $atd['student_code'],
                            'class_code' => $atd['class_code'],
                            'date' => Carbon::now(),
                            'status' => $atd['status'],
                            'noted' => $atd['noted'],
                        ]);
                        // Attendance::create($atd);
                    }

                    return response()->json($attendances, 200);                         
                }
            } else {

                return response()->json([
                    'message' => 'Đã quá 15 phút',
                ]);
            }
            

        } catch (Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $classCode)
    {
        try {
            $attendances = Classroom::where('class_code', $classCode)
                                    ->with('users', 'schedules')
                                    ->get()
                                    ->map(function ($attendance) {
                                        // Duyệt qua từng user để lấy các `student_code` và `full_name`
                                        $users = $attendance->users->map(function ($user) {
                                            return [
                                                'student_code' => $user->user_code,
                                                'full_name' => $user->full_name,
                                            ];
                                        });
                                        
                                        // Duyệt qua từng schedule để lấy `date`
                                        $schedules = $attendance->schedules->map(function ($schedule) {
                                            return $schedule->date;
                                        });
                                        $schedules = '2024-11-20';
                                        if ($schedules == (Carbon::now()->toDateString())) {
                                            
                                            return [
                                                'users' => $users,
                                                'class_code' => $attendance->class_code,
                                                'schedules' => $schedules,
                                            ];                                                
                                        } else {

                                            return $this->handleInvalidId();
                                        }
                                    });
            if (!$attendances) {

                return $this->handleInvalidId();
            } else {

                return response()->json($attendances, 200);                
            }
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendanceRequest $request, string $classCode)
    {
        try {
            $attendances = $request->validated();
            // Log::info('Request Data:', $request->all());
            $startTime = Carbon::createFromFormat('H:i', $this->startTime($classCode));
            $currentTime = Carbon::now(); // Lay gio hien tai
            // $currentTime = Carbon::createFromFormat('H:i', '07:01'); // Fix cung gio hien tai

            if ($currentTime->diffInMinutes($startTime) <= 15) {
                // Kiểm tra nếu dữ liệu là mảng và có dữ liệu
                if (is_array($attendances) && count($attendances) > 0) {
                    foreach ($attendances as $atd) {
                        Attendance::where('student_code', $atd['student_code'])
                                    ->update([
                                        'student_code' => $atd['student_code'],
                                        'class_code' => $atd['class_code'],
                                        'date' => Carbon::now(),
                                        'status' => $atd['status'],
                                        'noted' => $atd['noted'],
                                    ]);
                    }

                    return response()->json($attendances, 200);                         
                }
            } else {

                return response()->json([
                    'message' => 'Đã quá 15 phút',
                ]);
            }
            

        } catch (Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    public function showAll(string $classCode)
    {
        try {
            $attendances = Classroom::where('class_code', $classCode)
                                    ->with('users', 'schedules')
                                    ->get()
                                    ->map(function ($attendance) {
                                        // Duyệt qua từng user để lấy các `student_code` và `full_name`
                                        $users = $attendance->users->map(function ($user) {
                                            return [
                                                'student_code' => $user->user_code,
                                                'full_name' => $user->full_name,
                                            ];
                                        });
                                        
                                        // Duyệt qua từng schedule để lấy `date`
                                        $schedules = $attendance->schedules->map(function ($schedule) {
                                            return $schedule->date;
                                        });

                                        if ($schedules == (Carbon::now()->toDateString())) {
                                            
                                            return [
                                                'users' => $users,
                                                'class_code' => $attendance->class_code,
                                                'schedules' => $schedules,
                                            ];                                                
                                        } else {

                                            return $this->handleInvalidId();
                                        }
                                    });
            if (!$attendances) {

                return $this->handleInvalidId();
            } else {

                return response()->json($attendances, 200);                
            }
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $classCode)
    {
        // try {
        //     $attendances = Attendance::where('class_code', $classCode)->first();
        //     if (!$attendances) {

        //         return $this->handleInvalidId();
        //     } else {
        //         $attendances->delete($attendances);

        //         return response()->json([
        //             'message' => 'Xoa thanh cong'
        //         ], 200);            
        //     }
        // } catch (Throwable $th) {

        //     return $this->handleErrorNotDefine($th);
        // }
    }
    
}
