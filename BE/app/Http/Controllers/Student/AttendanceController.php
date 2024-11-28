<?php

namespace App\Http\Controllers\Student;

use Throwable;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Category;
use App\Models\Classroom;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $userCode = $request->user()->user_code;
            // $userCode = 'student05';

            $semesterCodeUser = User::where('user_code', $userCode)
                                    ->select('semester_code')
                                    ->first();

            $semesterCode = $request->input('search') ?: $semesterCodeUser->semester_code;
        
            $listSemester = Category::where('type', 'semester')
                ->where('is_active', '1')
                ->where('cate_code', '<=', $semesterCodeUser->semester_code) 
                ->orderBy('cate_code', 'asc')
                ->select('cate_code', 'cate_name')
                ->get();
           
            $classrooms = Classroom::whereHas('subject', function ($query) use ($semesterCode) {
                                        $query->where('semester_code', $semesterCode);
                                    })
                                    ->whereHas('users', function ($query) use ($userCode) {
                                        $query->where('classroom_user.user_code', $userCode);
                                    })
                                    ->with([
                                        'subject' => function ($query) {
                                            $query->select('subject_code', 'subject_name', 'semester_code');
                                        },
                                        'teacher' => function ($query) {
                                            $query->select('user_code', 'full_name');
                                        },
                                        'schedules.session' => function ($query) {
                                            $query->select('cate_code', 'cate_name');
                                        },
                                        'attendance' => function ($query) use ($userCode) {
                                            $query->where('student_code', $userCode)
                                                ->select('id', 'student_code', 'class_code', 'status', 'noted', 'date');
                                        }
                                    ])
                                    ->get(['class_code', 'class_name', 'subject_code', 'user_code']);
                            
            // $result = $classrooms->groupBy('class_code')->map(function ($classGroup) {
            //     $firstAttendance = $classGroup->first();
                
            //     // Lấy tất cả các lịch học từ lớp học
            //     $schedules = $firstAttendance->schedules;

            //     // Gộp dữ liệu điểm danh và lịch học
            //     $attendanceData = $classGroup->map(function ($attendance) use ($schedules) {
            //         dd($attendance->attendance->date);
            //         // Lấy cate_code từ lịch học tương ứng (nếu có)
            //         $schedule = $schedules->firstWhere('date', Carbon::parse($attendance->attendance->date)->toDateString());
            //         return [
            //             'date' => Carbon::parse($attendance->date)->toDateString(),
            //             'cate_name' => $schedule->session->cate_name ?? null,
            //             'full_name' => $attendance->classroom->teacher->full_name,
            //             'status' => $attendance->status,
            //             'noted' => $attendance->noted,
            //         ];
            //     });
            
            //     $attendanceDates = $attendanceData->pluck('date')->toArray();
            
            //     // Duyệt qua các lịch học và lọc ra các lịch không có trong dữ liệu điểm danh
            //     $scheduleData = $schedules->filter(function ($schedule) use ($attendanceDates) {
            //         return !in_array(Carbon::parse($schedule->date)->toDateString(), $attendanceDates);
            //     })->map(function ($schedule) {
            //         return [
            //             'date' => Carbon::parse($schedule->date)->toDateString(),
            //             'full_name' => null,
            //             'status' => null,
            //             'noted' => 'Chưa điểm danh',
            //         ];
            //     });
            
            //     // Kết hợp danh sách điểm danh và lịch học
            //     $finalData = $attendanceData->merge($scheduleData)->sortBy('date')->values();
            //     $totalSchedule = $finalData->count();
            //     // Đếm số lần status là 'absent'
            //     $absentCount = $attendanceData->where('status', 'absent')->count();
            //     // dd($absentCount);
            //     return [
            //         'class_code' => $firstAttendance->class_code,
            //         'class_name' => $firstAttendance->classroom->class_name,
            //         'subject_name' => $firstAttendance->classroom->subject->subject_name,
            //         'total_absent' => $absentCount,
            //         'total_schedule' => $totalSchedule,
            //         'attendance' => $finalData,
            //     ];
            // })->values()->all();
            $result = $classrooms->map(function ($classroom) {
                $schedules = $classroom->schedules; // Lấy danh sách lịch học
                $attendances = $classroom->attendance; // Lấy danh sách điểm danh
            
                // Nếu attendance rỗng, tạo dữ liệu mặc định chỉ từ schedules
                if ($attendances->isEmpty()) {
                    $attendanceData = collect([]);
                } else {
                    $attendanceData = $attendances->map(function ($attendance) use ($schedules) {
                        $schedule = $schedules->firstWhere('date', Carbon::parse($attendance->date)->toDateString());
                        return [
                            'date' => Carbon::parse($attendance->date)->toDateString(),
                            'cate_name' => optional($schedule->session)->cate_name ?? null,
                            'full_name' => optional($attendance->classroom->teacher)->full_name,
                            'status' => $attendance->status,
                            'noted' => $attendance->noted,
                        ];
                    });
                }
            
                $attendanceDates = $attendanceData->pluck('date')->toArray();
            
                // Lấy các lịch học không có trong attendance
                $scheduleData = $schedules->filter(function ($schedule) use ($attendanceDates) {
                    return !in_array(Carbon::parse($schedule->date)->toDateString(), $attendanceDates);
                })->map(function ($schedule) {
                    return [
                        'date' => Carbon::parse($schedule->date)->toDateString(),
                        'cate_name' => optional($schedule->session)->cate_name ?? null,
                        'full_name' => null,
                        'status' => null,
                        'noted' => 'Chưa điểm danh',
                    ];
                });
            
                // Kết hợp attendance và schedule, sắp xếp theo ngày
                $finalData = $attendanceData->merge($scheduleData)->sortBy('date')->values();
            
                return [
                    'class_code' => $classroom->class_code,
                    'class_name' => $classroom->class_name,
                    'subject_name' => $classroom->subject->subject_name,
                    'total_absent' => $attendanceData->where('status', 'absent')->count(),
                    'total_schedule' => $finalData->count(),
                    'attendance' => $finalData,
                ];
            })->values()->all();
                            

            return response()->json([
                'semesters' => $listSemester,
                'attendances' => $result,
                'semesterCode' => $semesterCode,
            ], 200);
        } catch (Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định!' .$th->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $semesterCode)
    {

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
