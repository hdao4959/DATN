<?php
namespace BE\App\Repositories;

use App\Models\Category;
use App\Models\Classroom;
use BE\App\Repositories\Contracts\ScoreRepositoryInterface;

class ScoreRepository implements ScoreRepositoryInterface{
    public function getById($id){
        $scores = Classroom::where('id',$id)->pluck('score');
        return $scores;
    }

    public function create($id){
        $pointHead = Category::query()
        ->select(['cate_code','cate_name','value'])
        ->where('type','=','point_head')
        ->get();

         $students = Classroom::where('id', $id)->pluck('students')->first();
         if (!$students) {
            return response()->json(['message' => 'No students found'], 404);
        }
         $list = [];
         foreach($pointHead as $point){
            $list_students = [];
            foreach ($students as $student) {

                $list_students[] = [
                    'user_code' => $student['student_code'],
                    'score'      => 0,
                    'note'   => null,
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
         return $examscore->update(['exam_score'=>$list]);
    }

    public function addStudent(){

    }

    public function update(){

    }

    public function delete(){

    }
}
