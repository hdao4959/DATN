<?php

namespace App\Http\Controllers\Student;

use Throwable;
use App\Models\Category;
use App\Models\Classroom;
use Illuminate\Http\Request;
use App\Models\ClassroomUser;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class ScoreController extends Controller
{
    // Hiển thị điểm theo kỳ
    public function bangDiemTheoKy(Request $request)
    {
        try {
            $userCode = $request->user()->user_code;
            // $userCode = 'student04';
            $semesterCode = $request->input('search');
            $listSemester = Category::where('type', 'semester')
                                    ->where('is_active', '1')
                                    ->select('cate_code', 'cate_name')
                                    ->get();

            $classRooms = ClassroomUser::whereHas('classroom.subject', function ($query) use ($semesterCode) {
                $query->where('semester_code', $semesterCode);
            })
            ->where('user_code', 'student04')
            ->with(['classroom' => function ($query) {
                $query->select('class_code', 'class_name', 'score');
            }])
            ->get()
            ->map(function ($classroomUser) {
                return $classroomUser->classroom; // Lấy ra chỉ dữ liệu của classroom
            });
            
            $data = json_decode($classRooms, true);

            $result = [];

            // Duyệt qua từng lớp học
            foreach ($data as $classGroup) {
                foreach ($classGroup as $class) {
                    $classInfo = [
                        'class_code' => $class['class_code'],
                        'class_name' => $class['class_name'],
                        'students' => []
                    ];
                    
                    if ($class['score']) {
                        $scoreData = json_decode($class['score'], true);
                        
                        // Kiểm tra và thêm thông tin điểm của sinh viên vào mảng
                        foreach ($scoreData['students'] as $student) {
                            if ($student['student_code'] === $userCode) {
                                // $studentInfo = [
                                //     'name' => $student['name'],
                                //     'student_code' => $student['student_code'],
                                //     'scores' => $student['scores']
                                // ];
                                $classInfo['students'] = $student['scores'];
                            }
                        }
                    }
                    
                    $result[] = $classInfo;
                }
            }
            return response()->json($result, 200);
        } catch (Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định!'
            ], 500);
        }
    }

    //////// END
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
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
