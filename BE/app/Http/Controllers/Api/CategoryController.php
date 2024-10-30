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
use App\Models\Classroom;

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
            ->where('parent_code', '=', null)
            ->get();
        // dd($categories);
        $data = $categories->map(function ($category) {
            // Lấy danh mục con dựa trên parent_code
            $subCategories = DB::table('categories')
                ->where('parent_code', '=', $category->cate_code)
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
        $semester = $this->generateSemester();

        // dd($listHocSinh);
        return response()->json($this->assignClasses($listHocSinh, $listPhonghoc, $listMonHoc, $daysOfWeek, $semester));
    }

    private function generateStudentList()
    {
        $studentList = DB::table('users')->where('role', '=', '3')->where('is_active', '=', 1)->get();
        $students = $studentList->map(function ($student) {
            return [
                'maHS' => $student->user_code,
                'ten' => $student->full_name,
                'chuyenNganh' => $student->major_code,
                'chuyenNganhHep' => $student->narrow_major_code,
                'hocKy' => $student->semester_code,
            ];
        })->toArray();
        // return dd($students);
        return $students;
    }

    private function generateTeacherList()
    {
        $teacherList = DB::table('users')->where('role', '=', '2')->where('is_active', '=', true)->get();
        $teachers = $teacherList->map(function ($teacher) {
            return [
                'maGV' => $teacher->user_code,
                'ten' => $teacher->full_name,
                'chuyenNganh' => $teacher->major_code,
                'chuyenNganhHep' => $teacher->narrow_major_code,
            ];
        })->toArray();
        return $teachers;
    }

    private function generateClassrooms()
    {
        $rooms = DB::table('categories')->where('type', '=', "school_room")->where('is_active', '=', true)->get();
        $classRooms = $rooms->map(function ($room) {
            return [
                'code' => $room->cate_code,
                'name' => $room->cate_name,
                'sucChua' => $room->value
            ];
        })->toArray();
        // dd($classRooms);
        return $classRooms;
    }

    private function generateSemester()
    {
        $rooms = DB::table('categories')->where('type', '=', "semester")->where('is_active', '=', true)->get();
        $classRooms = $rooms->map(function ($room) {
            return [
                'code' => $room->cate_code,
                'name' => $room->cate_name,
            ];
        })->toArray();
        return $classRooms;
    }

    private function generateSubjects()
    {
        $subjects = DB::table('subjects')->where('is_active', '=', true)->get();
        $subjectList = $subjects->map(function ($subject) {
            return [
                'code' => $subject->subject_code,
                'name' => $subject->subject_name,
                'tinChi' => $subject->credit_number,
                'chuyenNganh' => $subject->major_code,
                'hocKy' => $subject->semester_code,
            ];
        })->toArray();
        // return dd($subjectList);
        return $subjectList;
    }

    private function generateDaysOfWeek()
    {
        return [
            ["code" => "thu2", "name" => "Thứ Hai"],
            ["code" => "thu3", "name" => "Thứ Ba"],
        ];
    }

    // private function assignClasses($listHocSinh, $listPhonghoc, $listMonHoc, $daysOfWeek, $semesters)
    // {
    //     // dd($semesters);
    //     // dd($listHocSinh);

    //     $listLop = []; // Danh sách lớp học đã xếp
    //     $classTimes = $this->generateClassTimes(); // Danh sách ca học
    //     $teachersInMajor = $this->generateTeacherList();
    //     // dd($teachersInMajor);
    //     // Lưu trạng thái hiện tại của ngày, ca, và phòng cho mỗi môn
    //     $currentDayIndex = 0;
    //     $currentRoomIndex = 0;
    //     $currentTimeIndex = 0;

    //     // Lưu số buổi dạy của từng giảng viên
    //     $teacherWorkload = [];

    //     // Giữ phòng hiện tại của từng giảng viên
    //     $teacherRoom = [];
    //     // Duyệt qua từng môn học
    //     foreach ($semesters as $hocKy) {
    //         $hocKyHienTai = $hocKy['code'];

    //         foreach ($listMonHoc as $mon) {
    //             // Chỉ lọc các môn học thuộc học kỳ hiện tại
    //             if ($mon['hocKy'] !== $hocKyHienTai) {
    //                 continue; // Bỏ qua nếu môn không thuộc học kỳ hiện tại
    //             }

    //             // Bộ đếm lớp học cho mỗi môn
    //             $classCounter = 1;

    //             // Lọc danh sách học sinh theo chuyên ngành và học kỳ của môn học
    //             $studentsInClass = array_filter($listHocSinh, function ($hs) use ($mon, $hocKyHienTai) {
    //                 return ($hs['chuyenNganh'] === $mon['chuyenNganh'] || $hs['chuyenNganhHep'] === $mon['chuyenNganh'])
    //                     && $hs['hocKy'] === $hocKyHienTai;
    //             });


    //             // dd($studentsInClass);
    //             // dd($mon['chuyenNganh'],$hocKyHienTai);
    //             // Lấy danh sách giảng viên theo chuyên ngành của môn học

    //             $teachersForClass = array_filter($teachersInMajor, function ($gv) use ($mon) {
    //                 return $gv['chuyenNganh'] === $mon['chuyenNganh'] || $gv['chuyenNganhHep'] === $mon['chuyenNganh']; // Lọc giảng viên theo chuyên ngành
    //             });

    //             // Sắp xếp giảng viên theo số buổi dạy hiện tại, ưu tiên những người có ít buổi dạy hơn
    //             usort($teachersForClass, function ($a, $b) use ($teacherWorkload) {
    //                 return ($teacherWorkload[$a['maGV']] ?? 0) <=> ($teacherWorkload[$b['maGV']] ?? 0);
    //             });

    //             // Chọn giảng viên
    //             $currentTeacher = reset($teachersForClass);

    //             if (!$currentTeacher) {
    //                 // Nếu không có giảng viên phù hợp, để trống thông tin giảng viên
    //                 $currentTeacher = ['ten' => null];
    //                 $currentTeacher = ['maGV' => null];
    //             } else {

    //                 // Nếu giảng viên đã có phòng, ưu tiên giữ nguyên phòng
    //                 if (isset($teacherRoom[$currentTeacher['maGV']]) == true) {
    //                     $currentRoomIndex = array_search($teacherRoom[$currentTeacher['maGV']], array_column($listPhonghoc, 'code'));
    //                 }
    //             }

    //             // Tiếp tục vòng lặp qua các ngày, ca, và phòng học, bắt đầu từ trạng thái hiện tại
    //             $currentStudentIndex = 0; // Chỉ số học sinh bắt đầu từ 0 cho mỗi môn học
    //             $totalStudents = count($studentsInClass); // Tổng số học sinh cho môn này

    //             // Tiếp tục vòng lặp qua các ngày, ca, và phòng học, bắt đầu từ trạng thái hiện tại
    //             while ($currentStudentIndex < $totalStudents) {
    //                 // Kiểm tra nếu đã hết các ngày trong tuần
    //                 if ($currentDayIndex >= count($daysOfWeek)) {
    //                     break; // Dừng lại khi đã hết các ngày
    //                 }

    //                 // Lấy ngày hiện tại
    //                 $day = $daysOfWeek[$currentDayIndex];

    //                 // Lấy phòng học hiện tại
    //                 $phong = $listPhonghoc[$currentRoomIndex];

    //                 // Lấy ca học hiện tại
    //                 $classTime = $classTimes[$currentTimeIndex];
    //                 $listUser = $this->getStudentsInSameClassOrSession($classTime['code']);
    //                 // dd($listUser);
    //                 // Sức chứa của phòng học
    //                 $roomCapacity = $phong['sucChua'];

    //                 // Số lượng học sinh tối đa trong lớp là sức chứa của phòng hoặc số học sinh còn lại
    //                 $classSize = min($roomCapacity, $totalStudents - $currentStudentIndex);
    //                 if ($this->isConflict($listLop, $day['code'], $classTime['code'], $phong['code'])) {
    //                     $currentTimeIndex++;
    //                     if ($currentTimeIndex >= count($classTimes)) {
    //                         $currentTimeIndex = 0;
    //                         $currentRoomIndex++;
    //                         if ($currentRoomIndex >= count($listPhonghoc)) {
    //                             $currentRoomIndex = 0;
    //                             $currentDayIndex++;
    //                         }
    //                     }
    //                     continue;
    //                 }
    //                 // $dataStudents = $this->getListUserByClassRooms($phong['code'], $classTime['code'], $mon['code']);
    //                 // $dataStudents = $this->getListUserByClassRooms($classTime['code']);
    //                 // $validTimeIndex = $this->findValidClassTime($studentsInClass, $mon['code'], $day['code'], $currentTimeIndex, $classTimes);
    //                 // dd($classSize);
    //                 // $studentsToAdd = [];
    //                 // foreach (array_slice($studentsInClass, $currentStudentIndex, $classSize) as $student) {
    //                 //     $status = $this->checkStudentScheduleConflict(
    //                 //         $student['maHS'],
    //                 //         $mon['code'],
    //                 //         $phong['code'],
    //                 //         $classTime['code'],
    //                 //         $day['code']
    //                 //     );

    //                 //     if ($status === 'Không trùng') {
    //                 //         $studentsToAdd[] = $student;
    //                 //     } elseif ($status === 'Trùng ca học') {
    //                 //         $currentTimeIndex++;
    //                 //         if ($currentTimeIndex >= count($classTimes)) {
    //                 //             $currentTimeIndex = 0;
    //                 //             $currentRoomIndex++;
    //                 //             if ($currentRoomIndex >= count($listPhonghoc)) {
    //                 //                 $currentRoomIndex = 0;
    //                 //                 $currentDayIndex++;
    //                 //             }
    //                 //         }
    //                 //     }
    //                 // }

    //                 // if (empty($studentsToAdd)) break;

    //                 // dd($phong['code'], $classTime['code'], $mon['code']);
    //                 // dd($dataStudents,$studentsInClass);
    //                 // Kiểm tra nếu số học sinh còn lại để xếp lớp nhỏ hơn hoặc bằng 0
    //                 // dd($classSize);
    //                 if ($classSize <= 0) {

    //                     break; // Thoát vòng lặp nếu không còn học sinh để xếp lớp
    //                 }

    //                 // Tạo tên lớp, ví dụ: "Lớp MH101 - 1"
    //                 $className = "Lớp " . $mon['code'] . " - " . $classCounter;

    //                 // Tạo lớp cho môn học trong phòng này, ngày này, ca này
    //                 $listLop[] = [
    //                     "tenLop" => $className, // Tên lớp
    //                     "monHoc" => $mon['code'],
    //                     "phongHoc" => $phong['code'],
    //                     "ngay" => $day['code'], // Ngày học
    //                     "ca" => $classTime['code'], // Ca học
    //                     "giangVien" => $currentTeacher['ten'] ?? Null, // Giảng viên dạy
    //                     // "hocSinh" => array_slice($studentsInClass, $currentStudentIndex, $classSize), // Lấy tiếp học sinh từ vị trí hiện tại
    //                 ];

    //                 // Cập nhật chỉ số học sinh đã xếp vào lớp
    //                 $currentStudentIndex += $classSize; // Tăng chỉ số học sinh để không bị lặp
    //                 // dd($currentStudentIndex);
    //                 // Tăng số buổi dạy của giảng viên
    //                 if (!isset($teacherWorkload[$currentTeacher['maGV']])) {
    //                     $teacherWorkload[$currentTeacher['maGV']] = 0;
    //                 }
    //                 $teacherWorkload[$currentTeacher['maGV']]++;

    //                 // Lưu lại phòng hiện tại của giảng viên
    //                 $teacherRoom[$currentTeacher['maGV']] = $phong['code'];

    //                 // Tăng bộ đếm lớp cho môn học
    //                 $classCounter++;

    //                 // Cập nhật chỉ số ca học
    //                 $currentTimeIndex++;

    //                 // Nếu đã hết các ca trong ngày, chuyển sang phòng học tiếp theo
    //                 if ($currentTimeIndex >= count($classTimes)) {
    //                     $currentTimeIndex = 0;
    //                     // Kiểm tra phòng kế tiếp
    //                     $nextRoom = $this->findNextRoom($listPhonghoc, $phong, $currentRoomIndex);
    //                     $currentRoomIndex = array_search($nextRoom['code'], array_column($listPhonghoc, 'code'));
    //                 }

    //                 // Nếu đã hết các phòng trong ngày, chuyển sang ngày tiếp theo
    //                 if ($currentRoomIndex >= count($listPhonghoc)) {
    //                     $currentRoomIndex = 0;
    //                     $currentDayIndex++;
    //                 }

    //                 // Kiểm tra nếu đã hết các ngày trong tuần và thoát khỏi vòng lặp
    //                 if ($currentDayIndex >= count($daysOfWeek)) {
    //                     break; // Dừng lại khi đã hết các ngày trong tuần
    //                 }
    //             }
    //         }
    //     }
    //     return $listLop;
    // }

    // private function isConflict($listLop, $day, $classTime, $phong) {
    //     foreach ($listLop as $lop) {
    //         if ($lop['ngay'] === $day && $lop['ca'] === $classTime && $lop['phongHoc'] === $phong) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }


    private function assignClasses($listHocSinh, $listPhonghoc, $listMonHoc, $daysOfWeek, $semesters)
    {
        $listLop = [];
        $classTimes = $this->generateClassTimes();
        $teachersInMajor = $this->generateTeacherList();
        $teacherWorkload = [];
        $teacherRoom = [];

        // Khởi tạo lịch trống cho từng phòng học và ca học theo từng ngày
        $roomSchedule = [];
        foreach ($listPhonghoc as $room) {
            foreach ($daysOfWeek as $day) {
                foreach ($classTimes as $classTime) {
                    $roomSchedule[$room['code']][$day['code']][$classTime['code']] = true; // true là phòng trống
                }
            }
        }

        foreach ($semesters as $hocKy) {
            $hocKyHienTai = $hocKy['code'];

            foreach ($listMonHoc as $mon) {
                if ($mon['hocKy'] !== $hocKyHienTai) {
                    continue;
                }

                $studentsInClass = array_filter($listHocSinh, function ($hs) use ($mon, $hocKyHienTai) {
                    return ($hs['chuyenNganh'] === $mon['chuyenNganh'] || $hs['chuyenNganhHep'] === $mon['chuyenNganh'])
                        && $hs['hocKy'] === $hocKyHienTai;
                });

                $teachersForClass = array_filter($teachersInMajor, function ($gv) use ($mon) {
                    return $gv['chuyenNganh'] === $mon['chuyenNganh'] || $gv['chuyenNganhHep'] === $mon['chuyenNganh'];
                });

                usort($teachersForClass, function ($a, $b) use ($teacherWorkload) {
                    return ($teacherWorkload[$a['maGV']] ?? 0) <=> ($teacherWorkload[$b['maGV']] ?? 0);
                });

                $currentTeacher = reset($teachersForClass);
                $currentTeacher = $currentTeacher ?: ['maGV' => null, 'ten' => null];
                $classCounter = 1;
                $currentStudentIndex = 0;
                $totalStudents = count($studentsInClass);

                while ($currentStudentIndex < $totalStudents) {
                    $classAssigned = false;

                    foreach ($daysOfWeek as $day) {
                        foreach ($classTimes as $classTime) {
                            foreach ($listPhonghoc as $phong) {
                                if ($roomSchedule[$phong['code']][$day['code']][$classTime['code']] === false) {
                                    continue;
                                }

                                $roomCapacity = $phong['sucChua'];
                                $classSize = min($roomCapacity, $totalStudents - $currentStudentIndex);

                                $listLop[] = [
                                    "tenLop" => "Lớp " . $mon['code'] . "." . $classCounter,
                                    "maLop" => $mon['code'] . "." . $classCounter,
                                    "monHoc" => $mon['code'],
                                    "phongHoc" => $phong['code'],
                                    "ngay" => $day['code'],
                                    "ca" => $classTime['code'],
                                    "giangVien" => $currentTeacher['ten'],
                                ];

                                $currentStudentIndex += $classSize;
                                $classCounter++;
                                $teacherWorkload[$currentTeacher['maGV']] = ($teacherWorkload[$currentTeacher['maGV']] ?? 0) + 1;
                                $teacherRoom[$currentTeacher['maGV']] = $phong['code'];

                                $roomSchedule[$phong['code']][$day['code']][$classTime['code']] = false;
                                $classAssigned = true;
                                break 3;
                            }
                        }
                    }

                    if (!$classAssigned) {
                        break;
                    }
                }
            }
        }
        foreach ($listLop as $data) {
            Classroom::create([
                'class_code' => $data['maLop'],         
                'class_name' => $data['tenLop'],  
                'description' => "Lớp học cho môn {$data['monHoc']}",
                'is_active' => true,                      
                'subject_code' => $data['monHoc'],        
                // 'user_code' => $data['giangVien']                      
            ]);
        }
        
        return $listLop;
    }


    // public function getStudentsInSameClassOrSession($sessionCode)
    // {
    //     $user =  DB::table('classroom_user as cu')
    //         ->join('classrooms as c', 'cu.class_code', '=', 'c.class_code')
    //         ->join('schedules as d', 'd.class_code', '=', 'c.class_code')
    //         ->where('d.session_code', $sessionCode)
    //         ->select('cu.user_code', 'cu.class_code', 'd.session_code', 'd.room_code')
    //         ->distinct()
    //         ->get();
    //     return $user;
    // }


    // public function checkStudentScheduleConflict($userCode, $classCode, $roomCode, $sessionCode, $date)
    // {
    //     // Kiểm tra xem sinh viên đã có mặt trong lớp này chưa
    //     $alreadyEnrolled = DB::table('classroom_user')
    //         ->where('class_code', $classCode)
    //         ->where('user_code', $userCode)
    //         ->exists();

    //     if ($alreadyEnrolled) {
    //         return 'Đã xếp lớp';
    //     }

    //     // Kiểm tra xem sinh viên có trùng ca học trong cùng ngày và phòng không
    //     $scheduleConflict = DB::table('schedules')
    //         ->join('classroom_user', 'schedules.class_code', '=', 'classroom_user.class_code')
    //         ->where('classroom_user.user_code', $userCode)
    //         ->where('schedules.room_code', $roomCode)
    //         ->where('schedules.session_code', $sessionCode)
    //         ->where('schedules.date', $date)
    //         ->exists();

    //     return $scheduleConflict ? 'Trùng ca học' : 'Không trùng';
    // }


    // private function assignClasses($listHocSinh, $listPhonghoc, $listMonHoc, $daysOfWeek)
    // {
    //     $listLop = []; // Danh sách lớp học đã xếp
    //     $classTimes = $this->generateClassTimes(); // Danh sách ca học

    //     // Lưu trạng thái hiện tại của ngày, ca, và phòng cho mỗi môn
    //     $currentDayIndex = 0;
    //     $currentRoomIndex = 0;
    //     $currentTimeIndex = 0;

    //     // Lưu số buổi dạy của từng giảng viên
    //     $teacherWorkload = [];

    //     // Giữ phòng hiện tại của từng giảng viên
    //     $teacherRoom = [];

    //     // Duyệt qua từng môn học
    //     foreach ($listMonHoc as $mon) {
    //         // Bộ đếm lớp học cho mỗi môn
    //         $classCounter = 1;

    //         // Lọc danh sách học sinh theo chuyên ngành của môn học
    //         $studentsInClass = array_filter($listHocSinh, function ($hs) use ($mon) {
    //             return $hs['chuyenNganh'] === $mon['chuyenNganh']; // Lọc theo chuyên ngành
    //         });

    //         // Lấy danh sách giảng viên theo chuyên ngành của môn học
    //         $teachersInMajor = $this->generateTeacherList();
    //         // return dd($teachersInMajor);
    //         $teachersForClass = array_filter($teachersInMajor, function ($gv) use ($mon) {
    //             return $gv['chuyenNganh'] === $mon['chuyenNganh']; // Lọc giảng viên theo chuyên ngành
    //         });

    //         // Sắp xếp giảng viên theo số buổi dạy hiện tại, ưu tiên những người có ít buổi dạy hơn
    //         usort($teachersForClass, function ($a, $b) use ($teacherWorkload) {
    //             return ($teacherWorkload[$a['maGV']] ?? 0) <=> ($teacherWorkload[$b['maGV']] ?? 0);
    //         });

    //         // Chọn giảng viên
    //         $currentTeacher = reset($teachersForClass);

    //         // Nếu giảng viên đã có phòng, ưu tiên giữ nguyên phòng
    //         if (isset($teacherRoom[$currentTeacher['maGV']])) {
    //             $currentRoomIndex = array_search($teacherRoom[$currentTeacher['maGV']], array_column($listPhonghoc, 'code'));
    //         }

    //         $currentStudentIndex = 0; // Chỉ số học sinh hiện tại
    //         $totalStudents = count($studentsInClass); // Tổng số học sinh cho môn này

    //         // Tiếp tục vòng lặp qua các ngày, ca, và phòng học, bắt đầu từ trạng thái hiện tại
    //         while ($currentStudentIndex < $totalStudents) {
    //             // Kiểm tra nếu đã hết các ngày trong tuần
    //             if ($currentDayIndex >= count($daysOfWeek)) {
    //                 break; // Dừng lại khi đã hết các ngày
    //             }

    //             // Lấy ngày hiện tại
    //             $day = $daysOfWeek[$currentDayIndex];

    //             // Lấy phòng học hiện tại
    //             $phong = $listPhonghoc[$currentRoomIndex];

    //             // Lấy ca học hiện tại
    //             $classTime = $classTimes[$currentTimeIndex];

    //             // Sức chứa của phòng học
    //             $roomCapacity = $phong['sucChua'];

    //             // Số lượng học sinh tối đa trong lớp là sức chứa của phòng hoặc số học sinh còn lại
    //             $classSize = min($roomCapacity, $totalStudents - $currentStudentIndex);

    //             // Tạo tên lớp, ví dụ: "Lớp MH101 - 1"
    //             $className = "Lớp " . $mon['code'] . " - " . $classCounter;

    //             // Tạo lớp cho môn học trong phòng này, ngày này, ca này
    //             $listLop[] = [
    //                 "tenLop" => $className, // Tên lớp
    //                 "monHoc" => $mon['code'],
    //                 "phongHoc" => $phong['code'],
    //                 "ngay" => $day['code'], // Ngày học
    //                 "ca" => $classTime['code'], // Ca học
    //                 "giangVien" => $currentTeacher['ten'], // Giảng viên dạy
    //                 "hocSinh" => array_slice($studentsInClass, $currentStudentIndex, $classSize), // Danh sách học sinh trong lớp
    //             ];

    //             // Cập nhật chỉ số học sinh đã xếp vào lớp
    //             $currentStudentIndex += $classSize;

    //             // Tăng số buổi dạy của giảng viên
    //             if (!isset($teacherWorkload[$currentTeacher['maGV']])) {
    //                 $teacherWorkload[$currentTeacher['maGV']] = 0;
    //             }
    //             $teacherWorkload[$currentTeacher['maGV']]++;

    //             // Lưu lại phòng hiện tại của giảng viên
    //             $teacherRoom[$currentTeacher['maGV']] = $phong['code'];

    //             // Tăng bộ đếm lớp cho môn học
    //             $classCounter++;

    //             // Cập nhật chỉ số ca học
    //             $currentTimeIndex++;

    //             // Nếu đã hết các ca trong ngày, chuyển sang phòng học tiếp theo
    //             if ($currentTimeIndex >= count($classTimes)) {
    //                 $currentTimeIndex = 0;
    //                 // Kiểm tra phòng kế tiếp
    //                 $nextRoom = $this->findNextRoom($listPhonghoc, $phong, $currentRoomIndex);
    //                 $currentRoomIndex = array_search($nextRoom['code'], array_column($listPhonghoc, 'code'));
    //             }

    //             // Nếu đã hết các phòng trong ngày, chuyển sang ngày tiếp theo
    //             if ($currentRoomIndex >= count($listPhonghoc)) {
    //                 $currentRoomIndex = 0;
    //                 $currentDayIndex++;
    //             }

    //             // Kiểm tra nếu đã hết các ngày trong tuần và thoát khỏi vòng lặp
    //             if ($currentDayIndex >= count($daysOfWeek)) {
    //                 break; // Dừng lại khi đã hết các ngày trong tuần
    //             }
    //         }
    //     }

    //     return $listLop;
    // }

    // Hàm tìm phòng học liền kề hoặc giữ nguyên phòng
    // private function findNextRoom($listPhonghoc, $currentRoom, $currentRoomIndex)
    // {
    //     $currentRoomCode = intval(preg_replace('/\D/', '', $currentRoom['code'])); // Lấy mã số phòng hiện tại (chỉ lấy số)

    //     // Tìm phòng học liền kề (phòng kế tiếp hoặc giữ nguyên nếu không có phòng liền kề)
    //     foreach ($listPhonghoc as $room) {
    //         $roomCode = intval(preg_replace('/\D/', '', $room['code']));
    //         if ($roomCode === $currentRoomCode + 1 || $roomCode === $currentRoomCode - 1) {
    //             return $room; // Trả về phòng liền kề
    //         }
    //     }

    //     return $currentRoom; // Nếu không tìm thấy phòng liền kề, giữ nguyên phòng hiện tại
    // }


    private function generateClassTimes()
    {

        $sessions = DB::table('categories')->where('type', '=', "session")->where('is_active', '=', true)->get();
        $classTimes = $sessions->map(function ($session) {
            return [
                'code' => $session->cate_code,
                'name' => $session->cate_name
            ];
        })->toArray();
        return $classTimes;
    }

    // private function getListUserByClassRooms($sectionCode)
    // {

    //     // $classrooms = DB::table('classrooms')->where('room_code', '=', $roomCode)->where('subject_code', '=', $subjectCode)->where('section_code', '=', $sectionCode)->where('is_active', '=', true)->get();
    //     $classrooms = DB::table('classrooms')->where('section_code', '=', $sectionCode)->where('is_active', '=', true)->get();
    //     $class = $classrooms->map(function ($classroom) {
    //         return [
    //             'code' => $classroom->class_code,
    //             'name' => $classroom->class_name,
    //             'students' => $classroom->students,
    //             'teacher' => $classroom->user_code,
    //         ];
    //     })->toArray();
    //     return $class;
    // }
}
