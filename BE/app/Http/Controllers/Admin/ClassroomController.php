<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Classroom\HandleStep1;
use App\Http\Requests\Classroom\HandleStep2;
use App\Http\Requests\Classroom\HandleStep3;
use App\Http\Requests\Classroom\RenderClassroomRequest;

use App\Models\Classroom;
use App\Http\Requests\Classroom\StoreClassroomRequest;
use App\Http\Requests\Classroom\UpdateClassroomRequest;
use App\Models\Category;
use App\Models\ClassroomUser;
use App\Models\Schedule;
use App\Models\Subject;
use App\Models\User;
use DateInterval;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClassroomController extends Controller
{


    // Hàm trả về json khi id không hợp lệ
    public function handleInvalidId()
    {
        return response()->json([
            'status' => false,
            'message' => 'Lớp học không tồn tại!',
        ], 404);
    }

    //  Hàm trả về json khi lỗi không xác định (500)
    public function handleErrorNotDefine($th)
    {
        return response()->json([
            'status' => false,
            'message' => "Đã xảy ra lỗi không xác định",
            'error' => env('APP_DEBUG') ? $th->getMessage() : "Lỗi không xác định"
        ], 500);
    }


    public function index()
    {
        try {

            $classrooms = Classroom::with(['subject'])->where('is_active', true)->paginate(10);
            return response()->json([
                'status' => true,
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

    
    public function handleStep1(HandleStep1 $request){
        $data = $request->validated();
        $subject = Subject::firstWhere('subject_code', $data['subject_code']);
        $dateFrom = $data['date_from'];
        $studyDays = $data['study_days'];
        $study_dates = [];
        
        $curentDate = new DateTime($dateFrom);  
        do {
            if(in_array($curentDate->format('N'), $studyDays)){
                $study_dates[] = $curentDate->format('Y-m-d');
             }
            $curentDate->add(new DateInterval('P1D'));
        } while (count($study_dates) < $subject['total_sessions']);
        return response()->json($study_dates);
    }


    public function handleStep2(HandleStep2 $request){
        $data = $request->validated();
        $major_code = Subject::where([
            'is_active' => true, 
            'subject_code' => $data['subject_code']
        ])->value('major_code');

        $schedules_invalid = Schedule::whereIn('date', $data['list_study_dates'])
        ->where('session_code', $data['session_code'])
        ->select('class_code','room_code', 'session_code')->get();

        $rooms_invalid = $schedules_invalid->pluck('room_code');

        $rooms_valid = Category::where([
            'type' => 'school_room',
            'is_active' => true
        ])->whereNotIn('cate_code', $rooms_invalid)
        ->select('cate_code', 'cate_name', 'value')->get();
        
        $teachers_invalid = Classroom::whereIn('class_code', $schedules_invalid->select('class_code'))
        ->pluck('user_code');
        $teachers_valid = User::whereNotIn('user_code', $teachers_invalid)->where([
            'role' => '2',
            'is_active' => true,
            'major_code' => $major_code
        ])->select('user_code', 'full_name')->get();

        return response()->json([
            'status' => true,
            'rooms' => $rooms_valid,
            'teachers' => $teachers_valid
        ]);
    }

    public function handleStep3(HandleStep3 $request){

        try {
            $data = $request->validated();
            $classrooms = Classroom::where('class_code', 'LIKE', $data['course_code'] . '_' . $data['subject_code'].  '%')
            ->select('class_code', 'subject_code')->get();
            $subject = Subject::where([
                'is_active' => true,
                'subject_code' => $data['subject_code']
            ])->select('subject_code', 'semester_code', 'major_code')->first();
            $room_slot = Category::where([
                'is_active' => true,
                'type' => 'school_room',
                'cate_code' => $data['room_code']
            ])->value('value');
    
            $student_codes_invalid = ClassroomUser::whereIn('class_code', $classrooms->pluck('class_code'))
            ->pluck('user_code');
            
            $students_valid = User::whereNotIn('user_code', $student_codes_invalid)
            ->where([
                'is_active' => true,
                'major_code' => $subject['major_code'],
                'semester_code' => $subject['semester_code'],
                'course_code' => $data['course_code'],
                'role' => '3',
            ])->select('user_code', 'full_name', 'email', 'phone_number', 'address', 'sex', 'birthday', 'nation', 'avatar')
            ->limit($room_slot)->get();

            if(!$students_valid){
                return response()->json([
                    'status' => false,
                    'message' => 'Không có học sinh nào hợp lệ để có thể tạo lớp học này'
                ]);
            }
            return response()->json($students_valid);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
       
    }



    public function store(StoreClassroomRequest $request)
    {

        try {
            DB::beginTransaction();
            $data = $request->validated();
            $subject_code = $data['subject_code'];
            
            // // Lấy tất cả id lớp học dạy môn học này
            // $classroom_codes_with_subject = Classroom::where('subject_code', $subject_code)
            // ->pluck('class_code');
            
            // $student_codes_hasbeenStudy = [];
            // // Lấy tất cả id của học sinh đang học môn này
            // if($classroom_codes_with_subject->isNotEmpty()){
            //     $student_codes_hasbeenStudy = DB::table("classroom_user")
            //     ->whereIn('class_code', $classroom_codes_with_subject)
            //     ->pluck('user_code');
            // }
            // Lấy thông tin của môn học (Ngành, kỳ học)
            $subject = Subject::with('major', 'semester')->where('subject_code', $subject_code)->select('subject_code','total_sessions', 'semester_code', 'major_code')->first();
            $major_code = $subject->major->cate_code;
            $semester_code = $subject->semester_code;


            // // liệt kê danh sách id sinh viên tương ứng kỳ học + chuyên ngành + loại bỏ các học sinh đã được xếp lịch(Nếu có)
            // $room_slot = Category::where('cate_code' , $data_request['room_code'])->pluck('value')->first();
            // $list_student_codes = User::whereNotIn('user_code',$student_codes_hasbeenStudy)->where(
            //     [
            //         'major_code' => $major_code,
            //         'is_active' => true,
            //         'semester_code' => $semester_code,
            //         'role' => '3',
            //         'course_code' => $data_request['course_code']
            //     ]
            // )->limit($room_slot)->pluck('user_code');

                // return response()->json($list_student_codes);
            if (empty($data['student_codes'])) {
                return response()->json(
                    [
                        'status' => false,
                        'message' => 'Không có học sinh nào để có thể tạo lớp học!'
                    ], 422
                );
            }

            // Lấy tên lớp học được tạo gần nhất tương ứng với khoá + môn học
            $current_classcode = Classroom::where('class_code', 'LIKE', $data['course_code'] . "_" . $data['subject_code'] . ".%" )
            ->orderBy('class_code', 'desc')->pluck('class_code')->first();
            
            if($current_classcode){
               $dot_position = strrpos($current_classcode, '.');
               $number = (int) substr($current_classcode, $dot_position + 1) +1;
            }else{
                $number = 1;
            }
            $data_for_classrooms_table =  [
                "class_code"  => $data['course_code'] . "_" . $data['subject_code'] . "." . $number , 
                "class_name"  => $data['class_name'],
                "subject_code"  => $data['subject_code'], 
                "user_code"  => $data['user_code'] ?? null, //Mã giảng viên
            ];

            $classroom = Classroom::create($data_for_classrooms_table);
            $classroom->users()->attach($data['student_codes'] , ['class_code' => $classroom->class_code]);
            
            $data_to_insert_schedules_table = [];
            foreach($data['list_study_dates'] as $date){
                $data_to_insert_schedules_table[] = [
                    'class_code' => $classroom->class_code,
                    'session_code' => $data['session_code'], 
                    'room_code' => $data['room_code'],
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
                'status' => true,
                'message' => 'Xoá lớp học thành công!'
            ], 200);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }

}
