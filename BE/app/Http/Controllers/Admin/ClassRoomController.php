<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Http\Requests\Classroom\StoreClassroomRequest;
use App\Http\Requests\Classroom\UpdateClassroomRequest;
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

            $classrooms = Classroom::where('is_active', true)->paginate(10);

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


    public function renderScheduleForClassroom(StoreClassroomRequest $request)
    {
        try {
            $data = $request->except('date_from');
            $date_from = new DateTime($request->date_from);
            $subject_code = $data['subject_code'];
            $subject = Subject::where([
                'is_active' => true, 
                'subject_code' => $subject_code
            ])->select('total_sessions')->first();
            $total_sessions = $subject->total_sessions;

            $list_study_dates = [];
            do {
                $date_from->add(new DateInterval('P1D'));
                if (in_array($date_from->format('D'), $data['study_days'])) {
                    $list_study_dates[] = $date_from->format('d-m-Y');
                }
            } while (count($list_study_dates) < $total_sessions);

            return response()->json(
                [
                    'info' => $data,
                    'list_study_dates' => $list_study_dates
                ], 200
            );


        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }



    public function store(Request $request)
    {

        try {

            $data_request = $request->all();

            $subject_code = $data_request['subject_code'];
            $subject = Subject::with('major', 'semester')->where('subject_code', $subject_code)->first();
            // $course_code = $subject->
            // $major_code = $subject->major->cate_code;
            // $semester_code = $subject->semester->cate_code;

            $students = DB::table('users')->where(
                [
                    // 'course_code' => $course_code,
                    // 'major_code' => $major_code,
                    'is_active' => true
            ])->select('user_code')->get();
            // return response()->json($students);

            $list_study_dates = $request->list_study_dates;

            if(!array($list_study_dates) || count($list_study_dates) == 0){
                return response()->json(
                    ['message' => 'Lịch học không hợp lệ']
                );
            }


            $data =
                [
                    'class_code' => $data_request['class_code'],
                    'class_name' => $data_request['class_name'],
                    'section' => $data_request['section'],
                    'subject_code' => $data_request['subject_code'],
                    'study_schedule' =>  $list_study_dates,
                    'room_code' => $data_request['room_code'],
                    'is_active' => true
                ];


            Classroom::create($data);
            return response()->json([
                'message' => 'Tạo lớp thành công!'
            ], 201);
        } catch (\Throwable $th) {
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

            $classroom = Classroom::where([
                'class_code' =>  $classCode,
                'is_active' => true
            ])->first();

            if (!$classroom) {
                return $this->handleInvalidId();
            }

            return response()->json([
                'classroom' => $classroom,
                'message' => 'Lấy dữ liệu lớp học thành công!'
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
