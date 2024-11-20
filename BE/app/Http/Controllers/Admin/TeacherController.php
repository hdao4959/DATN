<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\DeleteTeacherRequest;
use App\Http\Requests\Teacher\StoreTeacherRequest;
use App\Http\Requests\Teacher\UpdateTeacherRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function handleInvalidId()
    {
        return response()->json([
            'status' => false,
            'message' => 'Giảng viên này không tồn tại!',
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

    public function handleConflict(){
        return response()->json([
            'status' => false,
            'message' => 'Giảng viên này đã được cập nhật trước đó, vui lòng cập nhật lại trang!'
        ],409);
    }

    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 10);
            $teachers = User::where([
                'role' => '2'
            ])->select(
                'user_code',
                'full_name',
                'email',
                'sex',
                'is_active'
            )->paginate($perPage);;
            return response()->json($teachers, 200);
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
    public function store(StoreTeacherRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            $newest_teacher_code = User::where('user_code', "LIKE", "TC%")
            ->orderBy('user_code', 'desc')->pluck('user_code')->first();

            $new_code = $newest_teacher_code ? (int) substr($newest_teacher_code, 2) : 0;
            $new_teacher_code = "TC" . str_pad($new_code + 1, 5, 0, STR_PAD_LEFT);
            $data['user_code'] = $new_teacher_code;
            $data['role'] = '2';
            User::create($data);
            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Thêm mới giảng viên thành công!'
            ],201);
        } catch (\Throwable $th) {
            DB::rollback();
            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $teacher_code)
    {
        try {
            $teacher = User::with([
                'major' => function ($query) {
                    $query->select('cate_code', 'cate_name');
                }
            ])->where('user_code', $teacher_code)
                ->select(
                    'user_code',
                    'full_name',
                    'email',
                    'phone_number',
                    'address',
                    'sex',
                    'birthday',
                    'citizen_card_number',
                    'issue_date',
                    'place_of_grant',
                    'nation',
                    'role',
                    'is_active',
                    'major_code',
                    'created_at',
                    'updated_at'
                )->first();


                $teacherArray = $teacher->toArray();
                $teacherArray['created_at'] = $teacher->created_at->toDateTimeString();
                $teacherArray['updated_at'] = $teacher->updated_at->toDateTimeString();
            return response()->json($teacherArray,200);
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeacherRequest $request, string $teacher_code)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            $teacher = User::where('user_code', $teacher_code)->lockForUpdate()->first();

            if(!$teacher){
                return $this->handleInvalidId();
            }

            if($teacher->updated_at->toDateTimeString() !== $data['updated_at']){
                return $this->handleConflict();
            }

            if(!isset($data['narrow_major_code'])){
                $data['narrow_major_code'] = null;
            }

            $teacher->update($data);
            return response()->json([
                'status' => true, 
                'message' => 'Chỉnh sửa thông tin giảng viên thành công!'
            ],200);
        } catch (\Throwable $th) {
            DB::rollback();
            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeleteTeacherRequest $request,  $teacher_code)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            $teacher = User::where('user_code', $teacher_code)->lockForUpdate()->first();

            if (!$teacher) {
                return $this->handleInvalidId();
            }

            if ($teacher->updated_at->toDateTimeString() !== $data['updated_at']) {
                return response()->json([
                    'status' => false,
                    'message' => 'Bản ghi này đã có cập nhật trước đó, vui lòng cập nhật lại trang!'
                ], 409);
            }

            $teacher->delete();
            DB::commit();
            return response()->json([
                'status' => true,
                'message' => 'Xóa giảng viên thành công!'
            ], 200);
        } catch (\Throwable $th) {
            DB::rollback();
            return $this->handleErrorNotDefine($th);
        }
    }
}