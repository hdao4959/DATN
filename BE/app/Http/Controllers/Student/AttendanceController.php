<?php

namespace App\Http\Controllers\Student;

use Throwable;
use Carbon\Carbon;
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
            $semesterCode = $request->input('search');

            $listSemester = Category::where('type', 'semester')
                                    ->where('is_active', '1')
                                    ->select('cate_code', 'cate_name')
                                    ->get();
            $attendances = Attendance::whereHas('classroom.subject', function ($query) use ($semesterCode) {
                                        $query->where('semester_code', $semesterCode);
                                    })
                                    ->where('student_code', $userCode)
                                    ->with(['classroom' => function ($query) {
                                        $query->select('class_code', 'class_name', 'subject_code', 'user_code');

                                    }, 'classroom.subject' => function ($query) {
                                        $query->select('subject_code', 'subject_name', 'semester_code');

                                    }, 'classroom.teacher' => function ($query) {
                                        $query->select('user_code', 'full_name');

                                    },'classroom.schedules.session' => function ($query) {
                                        $query->select('cate_code', 'cate_name'); // Tải thêm session
                                    }
                                ])
                                ->get(['id', 'student_code', 'class_code', 'status', 'noted', 'date']);
                            
            $result = $attendances->groupBy('class_code')->map(function ($classGroup) {
                $firstAttendance = $classGroup->first();
                
                // Lấy tất cả các lịch học từ lớp học
                $schedules = $firstAttendance->classroom->schedules;
            
                // Gộp dữ liệu điểm danh và lịch học
                $attendanceData = $classGroup->map(function ($attendance) use ($schedules) {
                    // Lấy cate_code từ lịch học tương ứng (nếu có)
                    $schedule = $schedules->firstWhere('date', Carbon::parse($attendance->date)->toDateString());
                    return [
                        'date' => Carbon::parse($attendance->date)->toDateString(),
                        'cate_name' => $schedule->session->cate_name ?? null,
                        'full_name' => $attendance->classroom->teacher->full_name,
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
                    'class_code' => $firstAttendance->class_code,
                    'class_name' => $firstAttendance->classroom->class_name,
                    'subject_name' => $firstAttendance->classroom->subject->subject_name,
                    'total_schedule' => $totalSchedule,
                    'total_absent' => $absentCount,
                    'attendance' => $finalData,
                ];
            })->values()->all();
                            

            return response()->json([
                'semesters' => $listSemester,
                'attendances' => $result
            ], 200);
        } catch (Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định!'
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
