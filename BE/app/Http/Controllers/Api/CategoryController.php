<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Api\CategoryRequest;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Category::get();

        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {

        try {
            $params = $request->except('_token');
            if ($request->hasFile('image')) {
                $fileName = $request->file('image')->store('uploads/category', 'public');
            } else {
                $fileName = null;
            }
            $params['image'] = $fileName;
            Category::create($params);

            return response()->json([
                'message' => 'Tạo mới thành công',
                'data' => $params
            ]);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $data = Category::query()->findOrFail($id);

            return response()->json([
                'message' => 'Chi tiết danh muc = ' . $id,
                'data' => $data
            ]);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);
            if ($th instanceof ModelNotFoundException) {
                return response()->json([
                    'message' => 'Không tồn tại id = ' . $id
                ], 404);
            } else {
                return response()->json([
                    'message' => 'Lỗi không xác định'
                ], 500);
            }
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, string $id)
    {
        try {
            $params = $request->except('_token', '_method');
            $listCategory = Category::findOrFail($id);
            if ($request->hasFile('image')) {
                if ($listCategory->image && Storage::disk('public')->exists($listCategory->image)) {
                    Storage::disk('public')->delete($listCategory->image);
                }
                $fileName = $request->file('image')->store('uploads/category', 'public');
            } else {
                $fileName = $listCategory->image;
            }
            $params['image'] = $fileName;
            $listCategory->update($params);

            return response()->json([
                'message' => 'Sửa thành công',
                'data' => $listCategory
            ], 201);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $listCategory = Category::findOrFail($id);
            if ($listCategory->image && Storage::disk('public')->exists($listCategory->image)) {
                Storage::disk('public')->delete($listCategory->image);
            }

            $listCategory->update($params);

            return response()->json([
                'message' => 'Xóa thành công'
            ], 200);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định'
            ], 500);
        }
    }

    public function updateActive(string $code)
    {
        try {
            $listCategory = Category::where('cate_code', $code)->firstOrFail();
            // dd(!$listCategory->is_active);
            $listCategory->update([
                'is_active' => !$listCategory->is_active
            ]);
            $listCategory->save();
            return response()->json([
                'message' => 'Cập nhật thành công',
                'error' => false
            ], 200);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định',
                'error' => true
            ], 500);
        }
    }

    public function getAllCategory(string $type)
    {
        // dd($type);
        $data = DB::table('categories')->where('type', '=', $type)->get();
        return response()->json($data);
    }

    public function getListCategory(string $type)
    {
        // Lấy tất cả danh mục cha
        // dd($type);
        $categories = DB::table('categories')
            ->where('type', '=', $type)
            ->where('parrent_code', '=', null)
            ->get();
            // dd($categories);
        $data = $categories->map(function ($category) {
            // Lấy danh mục con dựa trên parent_code
            $subCategories = DB::table('categories')
                ->where('parrent_code', '=', $category->cate_code)
                ->get();
            // Trả về cấu trúc dữ liệu theo yêu cầu
            return [
                'id' => $category->id,
                'cate_code' => $category->cate_code,
                'cate_name' => $category->cate_name,
                'image' => $category->image,
                'description' => $category->description,
                'listItem'  => $subCategories
            ];
        });
        return response()->json($data);
    }
   

    public function automaticClassroom()
    {
        $listHocSinh = $this->generateStudentList();
        $listPhonghoc = $this->generateClassrooms();
        $listMonHoc = $this->generateSubjects();
        $daysOfWeek = $this->generateDaysOfWeek();

        return response()->json($this->assignClasses($listHocSinh, $listPhonghoc, $listMonHoc, $daysOfWeek));
    }

    private function generateStudentList()
    {
        $listHocSinh = [];
        // $chuyenNganh = ["CS", "SE", "IS"]; // Mã các chuyên ngành

        // for ($i = 1; $i <= 2500; $i++) {
        //     // Chọn ngẫu nhiên chuyên ngành
        //     $randomIndex = array_rand($chuyenNganh);
        //     $randomChuyenNganh = $chuyenNganh[$randomIndex];

        //     $listHocSinh[] = [
        //         "maHS" => "HS$i",
        //         "ten" => "Học sinh $i",
        //         "ten" => $randomChuyenNganh // Gán mã chuyên ngành ngẫu nhiên
        //     ];
        // }

        // return $listHocSinh;
        $studentList = DB::table('users')->where('role', '=', "student")->where('is_active', '=', true)->get();
        $students = $studentList->map(function ($student) {
            return [
                'maHS' => $student->user_code,
                'ten' => $student->full_name,
                'chuyenNganh' => $student->majors_code,
            ];
        })->toArray();
        return $students;
    }

    private function generateClassrooms()
    {
        // return [
        //     ["code" => "phong1", "name" => "Phòng 1", "sucChua" => 31],
        //     ["code" => "phong2", "name" => "Phòng 2", "sucChua" => 24],
        //     ["code" => "phong3", "name" => "Phòng 3", "sucChua" => 28],
        //     ["code" => "phong4", "name" => "Phòng 4", "sucChua" => 22],
        //     ["code" => "phong5", "name" => "Phòng 4", "sucChua" => 22],
        //     ["code" => "phong6", "name" => "Phòng 4", "sucChua" => 22],
        //     ["code" => "phong7", "name" => "Phòng 4", "sucChua" => 22],
        //     ["code" => "phong8", "name" => "Phòng 4", "sucChua" => 22],
        //     ["code" => "phong9", "name" => "Phòng 4", "sucChua" => 22],
        //     ["code" => "phong10", "name" => "Phòng 10", "sucChua" => 26]
        // ];
        $rooms = DB::table('categories')->where('type', '=', "school_room")->where('is_active', '=', true)->get();
        $classRooms = $rooms->map(function ($room) {
            return [
                'code' => $room->cate_code,
                'name' => $room->cate_name,
                'sucChua' => $room->value
            ];
        })->toArray();
        return $classRooms;
    }

    private function generateSubjects()
    {
        // return [
        //     ["code" => "MH101", "name" => "Toán đại cương", "tinChi" => 3, "chuyenNganh" => "CS"],
        //     ["code" => "MH102", "name" => "Lập trình cơ bản", "tinChi" => 3, "chuyenNganh" => "SE"],
        //     ["code" => "MH103", "name" => "Giải tích", "tinChi" => 4, "chuyenNganh" => "IS"],
        //     ["code" => "MH104", "name" => "Cấu trúc dữ liệu", "tinChi" => 3, "chuyenNganh" => "CS"],
        //     ["code" => "MH105", "name" => "Hệ điều hành", "tinChi" => 3, "chuyenNganh" => "SE"],
        //     ["code" => "MH106", "name" => "Mạng máy tính", "tinChi" => 3, "chuyenNganh" => "IS"],
        //     ["code" => "MH107", "name" => "Cơ sở dữ liệu", "tinChi" => 3, "chuyenNganh" => "CS"],
        //     ["code" => "MH108", "name" => "Khoa học máy tính", "tinChi" => 3, "chuyenNganh" => "SE"],
        //     ["code" => "MH109", "name" => "Xử lý tín hiệu", "tinChi" => 3, "chuyenNganh" => "IS"],
        //     ["code" => "MH110", "name" => "Thiết kế web", "tinChi" => 3, "chuyenNganh" => "SE"],
        // ];

        $subjects = DB::table('subjects')->where('is_delete', '=', false)->where('is_active', '=', true)->get();
        $subjectList = $subjects->map(function ($subject) {
            return [
                'code' => $subject->subject_code,
                'name' => $subject->subject_name,
                'tinChi' => $subject->credit_number,
                'chuyenNganh' => $subject->narrow_major_code,
            ];
        })->toArray();
        return $subjectList;
    }

    private function generateDaysOfWeek()
    {
        return [
            ["code" => "thu2", "name" => "Thứ Hai"],
            ["code" => "thu3", "name" => "Thứ Ba"],
        ];
    }

    private function assignClasses($listHocSinh, $listPhonghoc, $listMonHoc, $daysOfWeek)
    {
        $listLop = []; // Danh sách lớp học đã xếp
        $classTimes = $this->generateClassTimes(); // Danh sách ca học

        // Lưu trạng thái hiện tại của ngày, ca, và phòng cho mỗi môn
        $currentDayIndex = 0;
        $currentRoomIndex = 0;
        $currentTimeIndex = 0;

        // Duyệt qua từng môn học
        foreach ($listMonHoc as $mon) {
            // Bộ đếm lớp học cho mỗi môn
            $classCounter = 1;

            // Lọc danh sách học sinh theo chuyên ngành của môn học
            $studentsInClass = array_filter($listHocSinh, function ($hs) use ($mon) {
                return $hs['chuyenNganh'] === $mon['chuyenNganh']; // Lọc theo chuyên ngành
            });

            $currentStudentIndex = 0; // Chỉ số học sinh hiện tại
            $totalStudents = count($studentsInClass); // Tổng số học sinh cho môn này

            // Tiếp tục vòng lặp qua các ngày, ca, và phòng học, bắt đầu từ trạng thái hiện tại
            while ($currentStudentIndex < $totalStudents) {
                // Kiểm tra nếu đã hết các ngày trong tuần
                if ($currentDayIndex >= count($daysOfWeek)) {
                    break; // Dừng lại khi đã hết các ngày
                }

                // Lấy ngày hiện tại
                $day = $daysOfWeek[$currentDayIndex];

                // Lấy phòng học hiện tại
                $phong = $listPhonghoc[$currentRoomIndex];

                // Lấy ca học hiện tại
                $classTime = $classTimes[$currentTimeIndex];

                // Sức chứa của phòng học
                $roomCapacity = $phong['sucChua'];

                // Số lượng học sinh tối đa trong lớp là sức chứa của phòng hoặc số học sinh còn lại
                $classSize = min($roomCapacity, $totalStudents - $currentStudentIndex);

                // Tạo tên lớp, ví dụ: "Lớp MH101 - 1"
                $className = "Lớp " . $mon['code'] . " - " . $classCounter;

                // Tạo lớp cho môn học trong phòng này, ngày này, ca này
                $listLop[] = [
                    "tenLop" => $className, // Tên lớp
                    "monHoc" => $mon['code'],
                    "phongHoc" => $phong['code'],
                    "ngay" => $day['code'], // Ngày học
                    "ca" => $classTime['code'], // Ca học
                    "hocSinh" => array_slice($studentsInClass, $currentStudentIndex, $classSize), // Danh sách học sinh trong lớp
                ];

                // Cập nhật chỉ số học sinh đã xếp vào lớp
                $currentStudentIndex += $classSize;

                // Tăng bộ đếm lớp cho môn học
                $classCounter++;

                // Cập nhật chỉ số ca học
                $currentTimeIndex++;

                // Nếu đã hết các ca trong ngày, chuyển sang phòng học tiếp theo
                if ($currentTimeIndex >= count($classTimes)) {
                    $currentTimeIndex = 0;
                    $currentRoomIndex++;
                }

                // Nếu đã hết các phòng trong ngày, chuyển sang ngày tiếp theo
                if ($currentRoomIndex >= count($listPhonghoc)) {
                    $currentRoomIndex = 0;
                    $currentDayIndex++;
                }

                // Kiểm tra nếu đã hết các ngày trong tuần và thoát khỏi vòng lặp
                if ($currentDayIndex >= count($daysOfWeek)) {
                    break; // Dừng lại khi đã hết các ngày trong tuần
                }
            }
        }

        return $listLop;
    }

    private function generateClassTimes()
    {
        // return [
        //     ["code" => "ca1", "name" => "Ca 1"],
        //     ["code" => "ca2", "name" => "Ca 2"],
        //     ["code" => "ca3", "name" => "Ca 3"],
        //     ["code" => "ca4", "name" => "Ca 4"],
        //     ["code" => "ca5", "name" => "Ca 5"],
        //     ["code" => "ca6", "name" => "Ca 6"],
        //     ["code" => "ca7", "name" => "Ca 7"]
        // ];

        $sessions = DB::table('categories')->where('type', '=', "session")->where('is_active', '=', true)->get();
        $classTimes = $sessions->map(function ($session) {
            return [
                'code' => $session->cate_code,
                'name' => $session->cate_name
            ];
        })->toArray();
        return $classTimes;
    }
}
