<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Classroom\RenderClassroomRequest;

use App\Models\Classroom;
use App\Http\Requests\Classroom\StoreClassroomRequest;
use App\Http\Requests\Classroom\UpdateClassroomRequest;
use App\Models\Category;
use App\Models\Schedule;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClassroomController extends Controller
{


    // Hàm trả về json khi id không hợp lệ
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

            $classrooms = Classroom::with(['subject'])->where('is_active', true)->paginate(10);
            if ($classrooms->isEmpty()) {
                return response()->json([
                    'message' => 'Không tìm thấy lớp học nào!'
                ], 404);
            }


            return response()->json([
                'message' => 'Lấy dữ liệu lớp học thành công',
                'classrooms' => $classrooms
            ], 200);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }



    // public function renderScheduleForStoreClassroom(RenderClassroomRequest $request)
    // {
    //     try {
    //         $data = $request->except('date_from');
    //         $date_from = new DateTime($request->date_from);
    //         $subject_code = $data['subject_code'];
    //         $list_teachers = User::where([
    //             'role' => 'teacher',
    //             'is_active' => true,
    //             'subject_code' => $subject_code
    //         ]);
    //         $subject = Subject::where([
    //             'is_active' => true,
    //             'subject_code' => $subject_code
    //         ])->select('total_sessions')->first();
    //         $total_sessions = $subject->total_sessions;

    //         $list_study_dates = [];
    //         do {
    //             $date_from->add(new DateInterval('P1D'));
    //             if (in_array($date_from->format('D'), $data['study_days'])) {
    //                 $list_study_dates[] = $date_from->format('d-m-Y');
    //             }
    //         } while (count($list_study_dates) < $total_sessions);

    //         return response()->json(
    //             [
    //                 'info' => $data,
    //                 'list_study_dates' => $list_study_dates,
    //                 'list_teachers' => $list_teachers
    //             ],
    //             200
    //         );
    //     } catch (\Throwable $th) {
    //         return $this->handleErrorNotDefine($th);
    //     }
    // }

    

    public function store(StoreClassroomRequest $request)
    {

        try {
            DB::beginTransaction();
            $data_request = $request->validated();

            $subject_code = $data_request['subject_code'];
            
            // Lấy tất cả id lớp học dạy môn học này
            $classroom_codes_with_subject = Classroom::where('subject_code', $subject_code)
            ->pluck('class_code');
            
            $student_codes_hasbeenStudy = [];
            // Lấy tất cả id của học sinh đang học môn này
            if($classroom_codes_with_subject->isNotEmpty()){
                $student_codes_hasbeenStudy = DB::table("classroom_user")
                ->whereIn('class_code', $classroom_codes_with_subject)
                ->pluck('user_code');
            }
            // Lấy thông tin của môn học (Ngành, kỳ học)
            $subject = Subject::with('major', 'semester')->where('subject_code', $subject_code)->select('subject_code','total_sessions', 'semester_code', 'major_code')->first();
            $major_code = $subject->major->cate_code;
            $semester_code = $subject->semester_code;


            // liệt kê danh sách id sinh viên tương ứng kỳ học + chuyên ngành + loại bỏ các học sinh đã được xếp lịch(Nếu có)
            $room_slot = Category::where('cate_code' , $data_request['room_code'])->pluck('value')->first();

            $list_student_codes = User::whereNotIn('user_code',$student_codes_hasbeenStudy)->where(
                [
                    'major_code' => $major_code,
                    'is_active' => true,
                    'semester_code' => $semester_code,
                    'role' => '3',
                    'course_code' => $data_request['course_code']
                ]
            )->limit($room_slot)->pluck('user_code');


            if ($list_student_codes->isEmpty()) {
                return response()->json(
                    [
                        'message' => 'Không có học sinh nào để có thể tạo lớp học!'
                    ], 422
                );
            }

            // Dữ liệu để thÊm trực tiếp vào bảng classroom
            $data_for_classrooms_table =  [
                "class_code"  => $data_request['class_code'], 
                "class_name"  => $data_request['class_name'], 
                "subject_code"  => $data_request['subject_code'], 
                "user_code"  => $data_request['user_code'] ?? null, //Mã giảng viên
            ];
            $classroom = Classroom::create($data_for_classrooms_table);
            $classroom->users()->attach($list_student_codes , ['class_code' => $classroom->class_code]);
            
            $data_to_insert_schedules_table = [];
            foreach($data_request['list_study_dates'] as $date){
                $data_to_insert_schedules_table[] = [
                    'class_code' => $classroom->class_code,
                    'session_code' => $data_request['session_code'], 
                    'room_code' => $data_request['room_code'],
                    'date' => $date,
                ];
            }
            // Thêm dữ liệu vào bảng lịch 
            Schedule::insert($data_to_insert_schedules_table);

            DB::commit();
            return response()->json([
                'message' => 'Tạo lớp thành công!'
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->handleErrorNotDefine($th);
        }
    }




    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Classroom  $classRoom
     * @return \Illuminate\Http\Response
     */
    public function show(string $classCode)
    {
        try {
            $classroom = Classroom::with([
                // Thông tin Môn học
                'subject' => function ($query) {
                    $query->select('subject_code', 'subject_name');
                },
                // Thông tin Giảng viên
                'teacher' => function ($query) {
                    $query->select('user_code', 'full_name', 'email', 'phone_number', 'major_code');
                },
                // Thông tin phòng học
                'schedules.room' => function($query){
                    $query->select( 'cate_code', 'cate_name');
                }, 
                'schedules.session' => function($query){
                    $query->select('cate_code', 'cate_name', 'value');
                }
            ])
                ->where(column: [
                    'class_code' =>  $classCode,
                    'is_active' => true
                ])->first();

            if (!$classroom) {
                return $this->handleInvalidId();
            }

            return response()->json([
                'message' => 'Lấy dữ liệu lớp học thành công!',
                'classroom' => $classroom
            ], 200);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }


    public function update(UpdateClassroomRequest $request, string $classCode)
    {

        return response()->json($request->all());
        // try {
        //     $data = $request->all();

        //     return response()->json($data);

        //     if ($request->has('is_active')) {
        //         $data['is_active'] = true;
        //     } else {
        //         $data['is_active'] = false;
        //     }

        //     $classroom = Classroom::where('class_code', $classCode)->first();

        //     if (!$classroom) {
        //         return $this->handleInvalidId();
        //     }

        //     $classroom->update($data);
        //     return response()->json([
        //         'message' => 'Cập nhật thông tin lớp học thành công!',
        //         'classroom' => $classroom
        //     ], 200);
        // } catch (\Throwable $th) {
        //     return $this->handleErrorNotDefine($th);
        // }
    }

    public function destroy(string $classCode)
    {
        try {
            $classroom = Classroom::where('class_code', $classCode)->first();

            if (!$classroom) {
                return $this->handleInvalidId();
            }

            // Xoá lớp học
            $classroom->delete();
            return response()->json([
                'message' => 'Xoá lớp học thành công'
            ], 200);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }

}
