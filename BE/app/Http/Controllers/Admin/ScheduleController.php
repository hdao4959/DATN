<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{

    public function handleInvalidId()
    {
        return response()->json([
            'status' => false,
            'message' => 'Lớp học này không tồn tại!',
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
    public function schedulesOfClassroom(string $class_code){
        try{
            $schedules = Schedule::where('class_code', $class_code)->get();
            return response()->json($schedules);
        }catch(\Throwable $th){
            return $this->handleErrorNotDefine($th);
        }
    }
}
