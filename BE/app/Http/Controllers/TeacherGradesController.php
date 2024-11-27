<?php

namespace App\Http\Controllers;

use App\Models\Grades;
use App\Http\Requests\UpdateGradesRequest;
use App\Models\ClassRoom;
use App\Models\Subject;
use App\Repositories\Contracts\GradeRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;
use Illuminate\Support\Facades\Auth;

class TeacherGradesController extends Controller
{
    public function index($classCode){
   
        try {
            // Lấy thông tin lớp học từ bảng classrooms
            $class = DB::table('classrooms')->where([
                'class_code' => $classCode,
                'is_active' => true
            ])->select('class_name', 'score', 'class_code', 'subject_code')->first();
            
            // Lấy danh sách sinh viên từ bảng classroom_user và nối với bảng users
            $listStudents = DB::table('classroom_user')
                ->join('users', 'classroom_user.user_code', '=', 'users.user_code')
                ->where('classroom_user.class_code', $classCode)
                ->select('users.full_name', 'classroom_user.user_code')
                ->get();
            
            // Lấy subject_code từ lớp học
            $subjectCode = $class->subject_code;
            
            // Tiến hành nối với bảng subjects để lấy assessments
            $subject = DB::table('subjects')
                ->where('subjects.subject_code', $subjectCode)
                ->select('subjects.subject_code', 'subjects.assessments')
                ->first();
            
            // Giải mã chuỗi assessments
            $assessments = json_decode($subject->assessments, true);
            
            // Giải mã chuỗi score nếu có
            $scoreArray = json_decode($class->score, true) ?? [];
    
            // Kiểm tra nếu scoreArray là mảng rỗng, tạo điểm mặc định
            if (($scoreArray)) {
                $scoreArray = []; // Khởi tạo lại scoreArray nếu rỗng
                
                // Lặp qua danh sách sinh viên để thêm thông tin điểm cho từng người
                foreach ($listStudents as $student) {
                    $scores = []; // Khởi tạo mảng scores cho mỗi sinh viên
                    
                    // Duyệt qua từng điểm trong assessments và tạo phần tử điểm cho mỗi sinh viên
                    foreach ($assessments as $assessmentName => $assessmentValue) {
                        $scores[] = [
                            'name' => $assessmentName, // Lấy tên điểm (ví dụ: final, midterm)
                            'note' => '', // Ghi chú (mặc định rỗng)
                            'score' => 0, // Điểm (mặc định là 0)
                            'value' => $assessmentValue // Lấy giá trị trọng số từ assessments
                        ];
                    }
    
                    // Thêm thông tin điểm của sinh viên vào mảng scoreArray
                    $scoreArray[] = [
                        'scores' => $scores, // Các điểm của sinh viên
                        'student_code' => $student->user_code, // Mã sinh viên
                        'student_name' => $student->full_name, // Tên sinh viên
                        'average_score' => 0 // Điểm trung bình (mặc định là 0)
                    ];
                }
            }
            return response()->json([
                'classCode' => $class->class_code,
                'className' => $class->class_name,
                'score' => $scoreArray, // Điểm lớp học (dưới dạng mảng)
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Có lỗi xảy ra' . $th->getMessage(),
                'error' => true,
            ]);
        }
    }
    public function getTeacherClass()
    {
        try {
            $user = Auth::user(); 
            $teacher_code = $user->user_code;
            // $teacher_code = 'TC969';
            $classrooms = Classroom::with([
                'subject' => function($query){
                    $query->select('subject_code', 'subject_name');
                
                }])->select('class_code', 'class_name', 'description', 'is_active', 'subject_code', 'user_code')->where('user_code', $teacher_code)->get();

            if($classrooms->isEmpty()){
                return response()->json(
                    ['message' => "Không có lớp học nào!"], 204
                );
            }
            return response()->json($classrooms,200);

        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Có lỗi xảy ra',
                'error' => true,
            ]);
        }
      
    }

    public function create()
    {
        //
    }
    
    public function show(Grades $grades) {}

    // public function getByParam(Request $request){
    //     try{
    //         $grade = $this->gradeRepository->getByParam($request);

    //         return response()->json($grade);
    //     }catch(ModelNotFoundException $e){
    //         return response()->json(['message'=>'không tìm thấy bản ghi'],404);
    //     }
    //     catch(\Throwable $th){
    //         return response()->json(['error'=>$th->getMessage()],500);
    //     }
    // }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Grades  $grades
     * @return \Illuminate\Http\Response
     */

     public function update(UpdateGradesRequest $request, $classCode)
     {
         try {
             $studentsData = $request->all(); 
            DB::table('classrooms')
                ->where('class_code', $classCode)
                ->update([
                    'score' => json_encode($studentsData), 
                    'updated_at' => now(),
                ]);
     
             return response()->json([
                 'message' => 'Cập nhật điểm thành công',
                 'error' => false,
                 'abc' => $studentsData
             ]);
         } catch (\Throwable $th) {
             return response()->json([
                 'message' => 'Có lỗi xảy ra: ' . $th->getMessage(),
                 'error' => true,
             ]);
         }
     }
     
     


}
