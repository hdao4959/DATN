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

    public function show(string $classCode)
    {
        try {

            $attendances = Classroom::where('class_code', $classCode)
                                    ->with('users', 'schedules')
                                    ->get()
                                    ->map(function ($attendance) {
                                        $currentDate = Carbon::now()->toDateString();

                                        // Lọc schedules theo ngày hiện tại
                                        $filteredSchedules = $attendance->schedules
                                            ->filter(function ($schedule) use ($currentDate) {
                                                return $schedule->date == $currentDate;
                                            })
                                            ->pluck('date')
                                            ->toArray();
                                
                                        // Gắn schedules vào từng user
                                        $usersWithSchedules = $attendance->users->map(function ($user) use ($filteredSchedules) {
                                            return [
                                                'student_code' => $user->user_code,
                                                'full_name' => $user->full_name,
                                                'schedules' => $filteredSchedules,
                                            ];
                                        });
                                
                                        // Trả về dữ liệu
                                        return [
                                            'class_code' => $attendance->class_code,
                                            'users' => $usersWithSchedules,
                                        ];
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

    public function edit(string $classCode)
    {
        try {
            $attendances = Attendance::where('class_code', $classCode)
                            ->whereDate('date', Carbon::today())
                            ->with('user')
                            ->get()
                            ->map(function ($attendance) {
                                return [
                                    'student_code' => $attendance->student_code,
                                    'full_name' => $attendance->user->full_name,
                                    'date' => $attendance->date,
                                    'status' => $attendance->status,
                                    'noted' => $attendance->noted,
                                ];
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

    public function showAllAttendance(Request $request, string $classCode)
    {
        try {
            $userCode = $request->user()->user_code;

            $attendances = Attendance::whereHas('classroom', function ($query) use ($userCode, $classCode) {
                                        $query->where('user_code', $userCode)->where('class_code', $classCode);
                                    })
                                    ->with(['classroom' => function ($query) {
                                        $query->select('class_code', 'class_name', 'subject_code', 'user_code');

                                        }, 'classroom.users' => function ($query) {
                                            $query->select('full_name');

                                        }, 'classroom.subject' => function ($query) {
                                            $query->select('subject_code', 'subject_name', 'semester_code');

                                        },'classroom.schedules.session' => function ($query) {
                                            $query->select('cate_code', 'cate_name'); // Tải thêm session
                                        }
                                    ])
                                    ->get(['id', 'student_code', 'class_code', 'status', 'noted', 'date']);
            // dd($attendances);
            $result = $attendances->groupBy('student_code')->map(function ($studentGroup) {
                $firstAttendance = $studentGroup->first();

                // Lấy `user_code` từ nhóm hiện tại
                $userCode = $firstAttendance->student_code;

                // Lấy `full_name` từ danh sách `users` dựa trên `user_code`
                $user = $firstAttendance->classroom->users->firstWhere('pivot.user_code', $userCode);
                $fullName = $user ? $user->full_name : null;
                
                // Lấy tất cả các lịch học từ lớp học
                $schedules = $firstAttendance->classroom->schedules;
            
                // Gộp dữ liệu điểm danh và lịch học
                $attendanceData = $studentGroup->map(function ($attendance) use ($schedules) {
                    // Lấy cate_code từ lịch học tương ứng (nếu có)
                    $schedule = $schedules->firstWhere('date', Carbon::parse($attendance->date)->toDateString());
                    return [
                        'date' => Carbon::parse($attendance->date)->toDateString(),
                        'cate_name' => $schedule->session->cate_name ?? null,
                        'status' => $attendance->status,
                        'noted' => $attendance->noted,
                    ];
                });
            
                $attendanceDates = $attendanceData->pluck('date')->toArray();
            
                // Duyệt qua các lịch học và lọc ra các lịch không có trong dữ liệu điểm danh
                $scheduleData = $schedules->filter(function ($schedule) use ($attendanceDates) {
                    return !in_array(Carbon::parse($schedule->date)->toDateString(), $attendanceDates);
                })->map(function ($schedule) {
                    return [
                        'date' => Carbon::parse($schedule->date)->toDateString(),
                        'full_name' => null,
                        'status' => null,
                        'noted' => 'Chưa điểm danh',
                    ];
                });
            
                // Kết hợp danh sách điểm danh và lịch học
                $finalData = $attendanceData->merge($scheduleData)->sortBy('date')->values();
                // Đếm số lần status là 'absent'
                $totalSchedule = $finalData->count();
                // dd($absentCount);
                $absentCount = $attendanceData->where('status', 'absent')->count();
                // dd($absentCount);
                return [
                    'student_code' => $userCode,
                    'full_name' => $fullName,
                    'total_schedule' => $totalSchedule,
                    'total_absent' => $absentCount,
                    'attendance' => $finalData,
                ];
            })->values()->all();
                            

            return response()->json($result, 200);
        } catch (Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định!'
            ], 500);
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
