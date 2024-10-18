<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ClassRoom;

class ExamScoreController extends Controller{

    public function getById(){
        $students = ClassRoom::all();
        return response()->json($students);
    }

    public function create($id){
        $pointHead = Category::query()
        ->select(['cate_code','cate_name','value'])
        ->where('type','=','point_head')
        ->get();

         $students = ClassRoom::where('id', $id)->pluck('students')->first();
         if (!$students) {
            return response()->json(['message' => 'No students found'], 404);
        }
         $list = [];
         foreach($pointHead as $point){
            foreach ($students as $student) {

                $list_students[] = [
                    'user_code' => $student['student_code'],
                    'score'      => 0,
                    'note'   => 0,
                ];
            }
            $list[] = [
                'cate_name'=> $point->cate_name,
                'cate_code'=> $point->cate_code,
                'value'    => $point->value,
                'list_student' => $list_students
            ];
         }

         $examscore = ClassRoom::findOrFail($id);
         $examscore->update(['exam_score'=>$list]);
        return response()->json(['message'=> 'cập nhật thành công']);
    }

    public function addStudent()
    {
        $students = [
            [
                'student_code' => 'PH12345',
            ],
            [
                'student_code' => 'PH65432',
            ],
            [
                'student_code' => 'PH12332',
            ]
        ];

        // Tìm lớp học
        $classroom = ClassRoom::findOrFail(2);

        // Cập nhật trường students với mảng JSON
        $classroom->update(['students' => $students]);

        return response()->json(['message'=>'sucess'] );
    }

    public function update(){

    }

    public function delete(){

    }
}
