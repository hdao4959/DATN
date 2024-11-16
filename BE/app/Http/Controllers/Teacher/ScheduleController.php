<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
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
    public function index(Request $request)
    {
        try {
            $userCode = $request->user()->user_code;
            $classCode = $request->input('class_code');

            $listClassRoom = Classroom::where('user_code', $userCode)->where('is_active', true)
                        ->when($classCode, function ($query, $classCode) {
                            return $query
                                ->where('class_code', 'like', "%{$classCode}%");
                        })->get(['class_code', 'class_name', 'description', 'subject_code']);
            if (!$listClassRoom) {
                return $this->handleInvalidId();
            }
            return response()->json($listClassRoom,200);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);  
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $classCode)
    {
        try {
            $userCode = $request->user()->user_code;

            $schedules = Classroom::where('user_code', $userCode)->where('class_code', $classCode)
                ->with(['schedules'])
                ->get()->flatMap(function ($classroom) {
                        return $classroom->schedules->map(function ($schedule) {
                            // Giải mã trường JSON `value` của `session`
                            $sessionValue = json_decode($schedule->session->value ?? '{}', true);
                        return [
                            'class_code' => $schedule->class_code,
                            'date' => $schedule->date,
                            'classroom' => [
                                'class_name' => $schedule->classroom->class_name ?? null,
                            ],
                            'room' => [
                                'cate_name' => $schedule->room->cate_name ?? null,
                            ],
                            'session' => [
                                'cate_code' => $schedule->session->cate_code ?? null,
                                'cate_name' => $schedule->session->cate_name ?? null,
                                'start_time' => $sessionValue['start'] ?? null,
                                'end_time' => $sessionValue['end'] ?? null,
                            ],
                        ];
                    });
                });
            if (!$schedules) {
                return $this->handleInvalidId();
            }
            return response()->json($schedules,200);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);  
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
