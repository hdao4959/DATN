<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class ClassroomController extends Controller
{
    /**
     * Display a listing of the resource.
     */


     public function handleInvalidId()
     {
         return response()->json([
             'message' => 'Lớp học không tồn tại!',
         ], 404);
     }
 
     //  Hàm trả về json khi lỗi không xác định (500)
     public function handleErrorNotDefine($th)
     {
         return response()->json([
             'message' => "Đã xảy ra lỗi không xác định",
             'error' => env('APP_DEBUG') ? $th->getMessage() : "Lỗi không xác định"
         ], 500);
     }


    public function index()
    {
        try {
            $teacher_code = request()->user()->user_code;
            $classrooms = Classroom::with([
                'subject' => function($query){
                    $query->select('subject_code', 'subject_name');
                
                }])->select('class_code', 'class_name', 'description', 'is_active', 'subject_code')->where('user_code', $teacher_code)->get();

            if($classrooms->isEmpty()){
                return response()->json(
                    ['message' => "Không có lớp học nào!"], 204
                );
            }
            return response()->json($classrooms,200);

        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
      
    }

    public function show(string $classcode)
    {
        try {
            $teacher_code = request()->user()->user_code;

            $classroom = Classroom::with( [
                'subject' => function($query){
                    $query->select('subject_code', 'subject_name', 'credit_number', 'total_sessions', 'description', 'semester_code', 'major_code' );
                },
                'subject.semester' => function($query){
                    $query->select('id','cate_code', 'cate_name');
                },
                'subject.major' => function($query){
                    $query->select('id','cate_code', 'cate_name');
                },
            ])->firstWhere([
                'class_code'=> $classcode,
            ]);

            if(!$classroom){
                return $this->handleInvalidId();
            }

            if($classroom->user_code !== $teacher_code){
                return response()->json('Bạn không dạy lớp học này', 403);
            }


            return response()->json($classroom,200);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
       
    }

    // public function listStudents(string $classcode){
    //     try {
    //         $teacher_code = request()->user()->user_code;
    //         $classroom = Classroom::where([
    //             'class_code' => $classcode, 
    //             'user_code' => $teacher_code
    //             ])
    //             ->select('class_code')->first();

    //         if(!$classroom){
    //             return response()->json([
    //                 'message' => 'Không tìm thấy lớp học nào!'], 404
    //             );
    //         }


    //         $student_codes = DB::table('classroom_user')
    //         ->where('class_code', $classroom->class_code)->pluck('user_code');
            
    //         if($student_codes->isEmpty()){
    //             return response()->json('Không có sinh viên nào!',404);
    //         }
    //         $list_students = User::whereIn('user_code', $student_codes)->get();
    //         return response()->json($list_students);
    //     } catch (\Throwable $th) {
    //         return $this->handleErrorNotDefine($th);
    //     }
    // }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }


}
