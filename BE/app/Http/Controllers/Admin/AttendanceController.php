<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Classroom;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\Attendance\StoreAttendanceRequest;
use App\Http\Requests\Attendance\UpdateAttendanceRequest;

class AttendanceController extends Controller
{
    // Hàm trả về json khi id không hợp lệ
    public function handleInvalidId()
    {

        return response()->json([
            'message' => 'Không có attendance nào!',
        ], 200);
    }

    //  Hàm trả về json khi lỗi không xác định (500)
    public function handleErrorNotDefine($th)
    {
        Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

        return response()->json([
            'message' => 'Lỗi không xác định!'
        ], 500);
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $classCode = $request->input('search');
            $classrooms = Classroom::query()
                                    ->when($classCode, function ($query, $classCode) {
                                        return $query
                                                ->where('class_code', 'like', "%{$classCode}%");
                                    })
                                    ->paginate(4);
            if ($classrooms->isEmpty()) {

                return $this->handleInvalidId();
            }

            return response()->json($classrooms, 200);
        } catch (Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceRequest $request)
    {
        try {
            $attendances = $request->except('_token');

            Attendance::create($attendances);

            return response()->json($attendances, 200);
        } catch (Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $classCode)
    {
        try {
            $attendances = Attendance::where('class_code', $classCode)
                                        ->with('user')
                                        ->get()
                                        ->map(function ($attendance) {
                                            return [
                                                'id' => $attendance->id,
                                                'student_code' => $attendance->student_code,
                                                'full_name' => $attendance->user ? $attendance->user->full_name : null,
                                                'class_code' => $attendance->class_code,
                                                'date' => $attendance->date,
                                                'status' => $attendance->status,
                                                'noted' => $attendance->noted,
                                            ];
                                        });
            // $attendances = Attendance::where('class_code', $classCode)->with('classroomUser')->get();
            if (!$attendances) {

                return $this->handleInvalidId();
            } else {

                return response()->json($attendances, 200);                
            }
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendanceRequest $request, string $id)
    {
        DB::beginTransaction();
        try {
            $attendances = Attendance::where('id', $id)->lockForUpdate()->first();
            if (!$attendances) {
                DB::rollBack();

                return $this->handleInvalidId();
            } else {
                $params = $request->except('_token', '_method');
      
                $attendances->update($params);
                DB::commit();

                return response()->json($attendances, 201);          
            }
        } catch (Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        DB::beginTransaction();
        try {
            $attendances = Attendance::where('id', $id)->lockForUpdate()->first();
            if (!$attendances) {
                DB::rollBack();

                return $this->handleInvalidId();
            } else {
                $attendances->delete($attendances);
                DB::commit();

                return response()->json([
                    'message' => 'Xoa thanh cong'
                ], 200);            
            }
        } catch (Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    public function bulkUpdateType(Request $request)
    {
        try {
            $actives = $request->input('status'); // Lấy dữ liệu từ request            
            foreach ($actives as $student_code => $active) {
                // Tìm Attendance theo ID và cập nhật trường 'status'
                $attendance = Attendance::findOrFail($student_code);
                $attendance->status = $active;
                $attendance->save();
            }

            return response()->json([
                'message' => 'Trạng thái đã được cập nhật thành công!'
            ], 200);
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }
}
