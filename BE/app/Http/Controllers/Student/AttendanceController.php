<?php

namespace App\Http\Controllers\Student;

use Throwable;
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
            // $userCode = 'student04';
            $semesterCode = $request->input('search');
            // $semesterCode = 'S01';

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

                                    }, 'classroom.schedules' => function ($query) {

                                    }])
                                    ->get(['id', 'student_code', 'class_code', 'status', 'noted']);
            $result = $attendances->groupBy('class_code')->map(function ($classGroup) {
                $firstAttendance = $classGroup->first();
                return [
                        
                    'class_code' => $firstAttendance->class_code,  
                    'class_name' => $firstAttendance->classroom->class_name,
                    'subject_name' => $firstAttendance->classroom->subject->subject_name,
                    'attendance' => $classGroup->map(function ($attendance) {
                        return [
                            'date' => $attendance->classroom->schedules->first()->date ?? null,
                            'session_cate_name' => $attendance->classroom->schedules->first()->session->cate_name ?? null, // Lấy cate_name đầu tiên                               
                            'teacher_name' => $attendance->classroom->teacher->full_name,
                            'status' => $attendance->status,
                            'noted' => $attendance->noted,     
                        ];
                    })->values()->all()     
                ];
            })->values()->all();
            // if ($attendances->isEmpty()) {

            //     return response()->json([
            //         'message' => 'Không có attendance nào!',
            //     ], 200);
            // }

            return response()->json([
                'semesters' => $listSemester,
                'attendances' => $result,
                'abc' => $attendances
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
