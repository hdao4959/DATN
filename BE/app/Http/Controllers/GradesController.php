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

class GradesController extends Controller
{
    // protected $gradeRepository;
    // public function __construct(GradeRepositoryInterface $gradeRepository){
    //     $this->gradeRepository = $gradeRepository;
    // }
    public function index($classCode)
    {
        // dd($classCode);
        try {
            $classRoom = DB::table('classrooms')->where([
                'class_code' => $classCode,
                'is_active' => true
            ])->select('class_name', 'score', 'students')->first();
            if ($classRoom) {
                $scoreJson = $classRoom->score;
                $scoreArray = json_decode($scoreJson, true);
                $studentArray = json_decode($classRoom->students, true);
                foreach ($studentArray as $student) {
                    $studentCode = $student['student_code'];

                    if (!$scoreArray) {
                        $scores = [
                            ['name' => 'Lab1', 'score' => 0, 'note' => ''],
                            ['name' => 'Lab2', 'score' => 0, 'note' => ''],
                            ['name' => 'Lab3', 'score' => 0, 'note' => ''],
                            ['name' => 'Lab4', 'score' => 0, 'note' => ''],
                            ['name' => 'Lab5', 'score' => 0, 'note' => ''],
                            ['name' => 'Lab6', 'score' => 0, 'note' => ''],
                            ['name' => 'Lab7', 'score' => 0, 'note' => ''],
                        ];
                    } else {
                        $scores = [];
                        foreach ($scoreArray as $scoreName => $scoreNumber) {
                            // dd(  $scoreNumber);
                            $scores = $scoreNumber['scores'];
                        }
                    }

                    // Thêm thông tin sinh viên vào mảng kết quả
                    $studentScores[] = [
                        'name' => $student['name'],
                        'student_code' => $studentCode,
                        'scores' => $scores
                    ];
                }

                return response()->json([
                    'roomName' => $classRoom->class_name,
                    'students' => $studentScores,
                    'error' => false
                ]);
            } else {
                return response()->json([
                    'message' => 'Không tìm thấy lớp học',
                    'error' => true
                ]);
            }
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Có lỗi xảy ra',
                'error' => true
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

    // public function update(Request $request, $id)
    // {
    //     try{
    //         $this->gradeRepository->update($request,$id);

    //         return response()->json(['message'=>'cập nhật điểm thành công'],200);
    //     }catch(\Throwable $th){
    //         return response()->json(['error'=>$th->getMessage()],500);
    //     }
    // }


}
