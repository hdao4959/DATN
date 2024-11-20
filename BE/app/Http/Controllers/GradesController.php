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
        try {
        $class = DB::table('classrooms')->where([
        'class_code' => $classCode,
        'is_active' => true
    ])->select('class_name', 'score', 'class_code')->first();
    // dd($class);
    if ($class) {
        $scoreJson = $class->score;
        $scoreArray = json_decode($scoreJson, true);
        $defaultScores = [
            ['name' => 'Lab1', 'score' => 0, 'note' => '', 'value' => 0],
            ['name' => 'Lab2', 'score' => 0, 'note' => '', 'value' => 0],
            ['name' => 'Lab3', 'score' => 0, 'note' => '', 'value' => 0],
            ['name' => 'Lab4', 'score' => 0, 'note' => '', 'value' => 0],
            ['name' => 'Lab5', 'score' => 0, 'note' => '', 'value' => 0],
            ['name' => 'Lab6', 'score' => 0, 'note' => '', 'value' => 0],
            ['name' => 'Lab7', 'score' => 0, 'note' => '', 'value' => 0],
            ['name' => 'Lab8', 'score' => 0, 'note' => '', 'value' => 0],
        ];
    
        foreach ($scoreArray as &$studentScore) {
            if (empty($studentScore['scores'])) {
                $studentScore['scores'] = $defaultScores;
                $studentScore['average_score'] = 0;
            }
        }
        
        return response()->json([
            'classCode' => $class->class_code,
            'className' => $class->class_name,
            'score' => $scoreArray ?? [],
        ]);
    } else {
        return response()->json([
            'message' => 'Không tìm thấy lớp học',
            'error' => true,
        ]);
    }
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

    public function update(Request $request, $classCode)
    {
        try {
            $studentsData = $request->all(); 
                DB::table('classrooms')
                    ->where('class_code', $classCode)
                    ->update([
                        'score' => json_encode($scores), 
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



