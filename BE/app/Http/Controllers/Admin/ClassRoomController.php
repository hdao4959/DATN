<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClassRoom;
use App\Http\Requests\Classroom\StoreClassRoomRequest;
use App\Http\Requests\Classroom\UpdateClassRoomRequest;

class ClassRoomController extends Controller
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
            $classrooms = ClassRoom::where('is_active', true)->paginate(10);

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

    public function store(StoreClassRoomRequest $request)
    {
        try {
            $data = $request->all();
            if(!$request->has('is_active')){
                $data['is_active'] = false;
            }else{
                $data['is_active'] = true;
            }
            ClassRoom::create($data);

            return response()->json(
                [
                    'message' => 'Thêm lớp học thành công!'
                ],201);

        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ClassRoom  $classRoom
     * @return \Illuminate\Http\Response
     */
    public function show(string $classCode)
    {
        try {
            $classroom = ClassRoom::where([
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


    public function update(UpdateClassRoomRequest $request, string $classCode)
    {
        try {
            $data = $request->all();

            if($request->has('is_active')){
                $data['is_active'] = true;
            }else{
                $data['is_active'] = false;
            }

            $classroom = Classroom::where('class_code', $classCode)->first();

            if(!$classroom){
                return $this->handleInvalidId();
            }

            $classroom->update($data);
            return response()->json([
                'message' => 'Cập nhật thông tin lớp học thành công!',
                'classroom' => $classroom
            ],200);
            
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
       
    }

    public function destroy(string $classCode)
    {
        try {
            $classroom = ClassRoom::where('class_code', $classCode)->first();

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
