<?php

namespace App\Http\Controllers\Api;

use Throwable;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;

class CategoryController extends Controller
{
    // CRUD chuyên mục

    // Hàm trả về json khi id không hợp lệ
    public function handleInvalidId()
    {

        return response()->json([
            'message' => 'Không có chuyên mục nào!',
        ], 404);
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
            // Tìm kiếm theo cate_name
            $search = $request->input('search');
            $data = Category::where('type', '=', 'category')
                                ->when($search, function ($query, $search) {
                                    
                                    return $query
                                            ->where('cate_name', 'like', "%{$search}%");
                                })
                                ->paginate(4);
            if ($data->isEmpty()) {

                return $this->handleInvalidId();
            }

            return response()->json($data, 200);
        } catch (Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        try {
            // Lấy ra cate_code và cate_name của cha
            $parent = Category::whereNull('parent_code')
                                ->where('type', '=', 'category')
                                ->select('cate_code', 'cate_name')
                                ->get();

            $params = $request->except('_token');
            if ($request->hasFile('image')) {
                $fileName = $request->file('image')->store('uploads/image', 'public');
            } else {
                $fileName = null;
            }

            $params['image'] = $fileName;
            Category::create($params);

            return response()->json($params, 200);
        } catch (Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $cate_code)
    {
        try {
            $category = Category::where('cate_code', $cate_code)->first();
            if (!$category) {

                return $this->handleInvalidId();
            } else {

                return response()->json($category, 200);                
            }
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, string $cate_code)
    {
        try {
            // Lấy ra cate_code và cate_name của cha
            $parent = Category::whereNull('parent_code')
                                ->where('type', '=', 'Category')
                                ->select('cate_code', 'cate_name')
                                ->get();

            $listCategory = Category::where('cate_code', $cate_code)->first();
            if (!$listCategory) {

                return $this->handleInvalidId();
            } else {
                $params = $request->except('_token', '_method');
                if ($request->hasFile('image')) {
                    if ($listCategory->image && Storage::disk('public')->exists($listCategory->image)) {
                        Storage::disk('public')->delete($listCategory->image);
                    }
                    $fileName = $request->file('image')->store('uploads/image', 'public');
                } else {
                    $fileName = $listCategory->image;
                }
                $params['image'] = $fileName;
                $listCategory->update($params);

                return response()->json($listCategory, 201);          
            }
        } catch (Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $cate_code)
    {
        try {
            $listCategory = Category::where('cate_code', $cate_code)->first();
            if (!$listCategory) {

                return $this->handleInvalidId();
            } else {
                if ($listCategory->image && Storage::disk('public')->exists($listCategory->image)) {
                    Storage::disk('public')->delete($listCategory->image);
                }
                $listCategory->delete($listCategory);

                return response()->json([
                    'message' => 'Xóa thành công'
                ], 200);            
            }
        } catch (Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    public function bulkUpdateType(Request $request)
    {
        try {
            $activies = $request->input('is_active'); // Lấy dữ liệu từ request            
            foreach ($activies as $cate_code => $active) {
                // Tìm category theo ID và cập nhật trường is_active
                $category = Category::findOrFail($cate_code);
                $category->ia_active = $active;
                $category->save();
            }

            return response()->json([
                'message' => 'Trạng thái đã được cập nhật thành công!'
            ], 200);
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }    

    // END CRUD chuyên mục

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

    public function uploadImage(Request $request)
    {
        if ($request->hasFile('image')) {
            // Xử lý tên file
            $fileName = $request->file('image')->store('uploads/image', 'public');
            return response()->json([
                'error' => false,
                'url' => Storage::url($fileName),  // Trả về URL chính xác
                'message' => 'Upload success'
            ], 200);
        }

        return response()->json([
            'error' => true,
            'url' => null,
            'message' => 'Upload failed'
        ], 400);
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
