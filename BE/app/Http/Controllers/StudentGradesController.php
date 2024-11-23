<?php

namespace App\Http\Controllers;

use App\Models\Grades;
use App\Http\Requests\UpdateGradesRequest;
use App\Models\ClassRoom;
use App\Models\Subject;
use App\Models\User;
use App\Repositories\Contracts\GradeRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;
use Illuminate\Support\Facades\Auth;
use App\Models\ClassroomUser;
use App\Models\Category;

class StudentGradesController extends Controller
{
    public function index(Request $request){

            try {
                $user = Auth::user();
                $studentCode = $user->user_code;
                // $studentCode = 'student04';
                $semesterCode = $request->input('search');
                // $semesterCode = 'S04';
                $listSemester = Category::where('type', 'semester')
                                        ->where('is_active', '1')
                                        ->select('cate_code', 'cate_name')
                                        ->get();

                $classes = DB::table('classroom_user')
                ->join('classrooms', 'classroom_user.class_code', '=', 'classrooms.class_code')
                ->join('subjects', 'classrooms.subject_code', '=', 'subjects.subject_code')
                ->where('classroom_user.user_code', $studentCode)
                ->where('subjects.semester_code', $semesterCode) // thêm điều kiện semester_code
                ->select('classrooms.class_code', 'classrooms.class_name', 'classrooms.score', 'subjects.subject_name', 'subjects.subject_code')
                ->get();

                if ($classes->isEmpty()) {
                    return response()->json([
                        'message' => 'Sinh viên này chưa tham gia lớp học nào',
                        'error' => true,
                        'semesters' => $listSemester
                    ]);
                }

                $classScores = [];
                foreach ($classes as $class) {
                    $scoreJson = $class->score;
                    $scoreArray = json_decode($scoreJson, true);
                    $studentScore = null;
                    if (is_array($scoreArray)) {
                        foreach ($scoreArray as $score) {
                            if (isset($score['student_code']) && $score['student_code'] === $studentCode) {
                                $studentScore = [
                                    'scores' => $score['scores'] ?? [],
                                    'student_code' => $score['student_code'],
                                    'student_name' => $score['student_name'] ?? '',
                                    'average_score' => $score['average_score'] ?? 0
                                ];
                                break;
                            }
                        }
                    }

                    $classScores[] = [
                        'class_code' => $class->class_code,
                        'class_name' => $class->class_name,
                        'subject_code' => $class->subject_code,
                        'subject_name' => $class->subject_name,
                        'score' => $studentScore ?? [],
                    ];
                }

                return response()->json([
                    'message' => 'Lấy thông tin lớp và điểm thành công',
                    'error' => false,
                    'data' => $classScores,
                    'semesters' => $listSemester

                ]);
            } catch (\Throwable $th) {
                return response()->json([
                    'message' => 'Có lỗi xảy ra: ' . $th->getMessage(),
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

    //  public function update(UpdateGradesRequest $request, $classCode)
    //  {

    //  }





}
