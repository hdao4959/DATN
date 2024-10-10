<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Api\CategoryRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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
            $listCategory->delete($listCategory);

            return response()->json([
                'message' => 'Xoa thanh cong'
            ], 404);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định'
            ], 500);
        }
    }

    public function getAllCategory(string $type)
    {
        // dd($type);
        $data = DB::table('categories')->where('type', '=', $type)->get();
        return response()->json($data);
    }


    // public function automaticClassroom()
    // {
    //     $listHocSinh = [];
    //     $chuyenNganh = ["CS", "SE", "IS"]; // Mã các chuyên ngành

    //     for ($i = 1; $i <= 100; $i++) {
    //         // Chọn ngẫu nhiên chuyên ngành
    //         $randomIndex = array_rand($chuyenNganh);
    //         $randomChuyenNganh = $chuyenNganh[$randomIndex];

    //         $listHocSinh[] = [
    //             "maHS" => "HS$i",
    //             "ten" => "Học sinh $i",
    //             "chuyenNganh" => $randomChuyenNganh // Gán mã chuyên ngành ngẫu nhiên
    //         ];
    //     }
    //     $listPhonghoc = [
    //         ["code" => "phong1", "name" => "Phòng 1", "sucChua" => 31],
    //         ["code" => "phong2", "name" => "Phòng 2", "sucChua" => 24],
    //         ["code" => "phong3", "name" => "Phòng 3", "sucChua" => 28],
    //         ["code" => "phong4", "name" => "Phòng 4", "sucChua" => 22],
    //         ["code" => "phong5", "name" => "Phòng 5", "sucChua" => 27],
    //         ["code" => "phong6", "name" => "Phòng 6", "sucChua" => 32],
    //         ["code" => "phong7", "name" => "Phòng 7", "sucChua" => 24],
    //         ["code" => "phong8", "name" => "Phòng 8", "sucChua" => 32],
    //         ["code" => "phong9", "name" => "Phòng 9", "sucChua" => 27],
    //         ["code" => "phong10", "name" => "Phòng 10", "sucChua" => 26],
    //         ["code" => "phong11", "name" => "Phòng 11", "sucChua" => 28],
    //         ["code" => "phong12", "name" => "Phòng 12", "sucChua" => 28],
    //         ["code" => "phong13", "name" => "Phòng 13", "sucChua" => 34],
    //         ["code" => "phong14", "name" => "Phòng 14", "sucChua" => 32],
    //         ["code" => "phong15", "name" => "Phòng 15", "sucChua" => 26],
    //         ["code" => "phong16", "name" => "Phòng 16", "sucChua" => 20],
    //         ["code" => "phong17", "name" => "Phòng 17", "sucChua" => 35],
    //         ["code" => "phong18", "name" => "Phòng 18", "sucChua" => 20],
    //         ["code" => "phong19", "name" => "Phòng 19", "sucChua" => 32],
    //         ["code" => "phong20", "name" => "Phòng 20", "sucChua" => 31],
    //         ["code" => "phong21", "name" => "Phòng 21", "sucChua" => 22],
    //         ["code" => "phong22", "name" => "Phòng 22", "sucChua" => 26],
    //         ["code" => "phong23", "name" => "Phòng 23", "sucChua" => 35],
    //         ["code" => "phong24", "name" => "Phòng 24", "sucChua" => 29],
    //         ["code" => "phong25", "name" => "Phòng 25", "sucChua" => 25],
    //         ["code" => "phong26", "name" => "Phòng 26", "sucChua" => 35],
    //         ["code" => "phong27", "name" => "Phòng 27", "sucChua" => 32],
    //         ["code" => "phong28", "name" => "Phòng 28", "sucChua" => 30],
    //         ["code" => "phong29", "name" => "Phòng 29", "sucChua" => 33],
    //         ["code" => "phong30", "name" => "Phòng 30", "sucChua" => 20]
    //     ];
    //     $listCaHoc = [
    //         ["code" => "ca1", "name" => "Ca 1"],
    //         ["code" => "ca2", "name" => "Ca 2"],
    //         ["code" => "ca3", "name" => "Ca 3"],
    //         ["code" => "ca4", "name" => "Ca 4"],
    //         ["code" => "ca5", "name" => "Ca 5"],
    //         ["code" => "ca6", "name" => "Ca 6"],
    //         ["code" => "ca7", "name" => "Ca 7"]
    //     ];
    //     $listMonHoc = [
    //         ["code" => "MH101", "name" => "Toán đại cương", "tinChi" => 3, "chuyenNganh" => "CS"],
    //         ["code" => "MH102", "name" => "Lập trình cơ bản", "tinChi" => 3, "chuyenNganh" => "SE"],
    //         ["code" => "MH103", "name" => "Giải tích", "tinChi" => 4, "chuyenNganh" => "IS"],
    //         ["code" => "MH104", "name" => "Cấu trúc dữ liệu", "tinChi" => 3, "chuyenNganh" => "CS"],
    //         ["code" => "MH105", "name" => "Hệ điều hành", "tinChi" => 3, "chuyenNganh" => "SE"],
    //         ["code" => "MH106", "name" => "Mạng máy tính", "tinChi" => 3, "chuyenNganh" => "IS"],
    //         ["code" => "MH107", "name" => "Cơ sở dữ liệu", "tinChi" => 3, "chuyenNganh" => "CS"],
    //         ["code" => "MH108", "name" => "Khoa học máy tính", "tinChi" => 3, "chuyenNganh" => "SE"],
    //         ["code" => "MH109", "name" => "Xử lý tín hiệu", "tinChi" => 3, "chuyenNganh" => "IS"],
    //         ["code" => "MH110", "name" => "Thiết kế web", "tinChi" => 3, "chuyenNganh" => "SE"],
    //     ];

    //     $daysOfWeek = [
    //         ["code" => "Mon", "name" => "Thứ Hai"],
    //         ["code" => "Tue", "name" => "Thứ Ba"],
    //         ["code" => "Wed", "name" => "Thứ Tư"],
    //         ["code" => "Thu", "name" => "Thứ Năm"],
    //         ["code" => "Fri", "name" => "Thứ Sáu"],
    //         ["code" => "Sat", "name" => "Thứ Bảy"],
    //         ["code" => "Sun", "name" => "Chủ Nhật"]
    //     ];

    //     $listLop = []; // Danh sách lớp học đã xếp
    //     $maxMonPerStudent = 3; // Mỗi học sinh có thể đăng ký tối đa 3 môn
    //     $dayCount = 5; // Số ngày trong tuần (Thứ Hai đến Thứ Sáu)

    //     // Duyệt qua từng môn học
    //     foreach ($listMonHoc as $mon) {
    //         // Lọc danh sách học sinh theo chuyên ngành của môn học
    //         $studentsInClass = array_filter($listHocSinh, function ($hs) use ($mon) {
    //             return $hs['chuyenNganh'] === $mon['chuyenNganh']; // Lọc theo chuyên ngành
    //         });

    //         $studentCount = count($studentsInClass); // Tổng số học sinh
    //         $classSize = 0; // Số học sinh trong lớp
    //         $classIndex = 1; // Đánh số lớp

    //         // Số lượng học sinh đã xếp vào lớp
    //         $currentStudentIndex = 0;

    //         while ($currentStudentIndex < $studentCount) {
    //             // Chọn phòng học phù hợp
    //             foreach ($listPhonghoc as $phong) {
    //                 // Nếu số học sinh hiện tại trong lớp < số học sinh cần xếp và phòng học đủ sức chứa
    //                 if ($classSize < $phong['sucChua'] && ($currentStudentIndex + $phong['sucChua'] <= $studentCount)) {
    //                     // Tạo lớp
    //                     $listLop[] = [
    //                         "monHoc" => $mon['code'],
    //                         "phongHoc" => $phong['code'],
    //                         "thoiGian" => [
    //                             "ngay" => $daysOfWeek[array_rand($daysOfWeek)]['code'], // Ngày học ngẫu nhiên
    //                             "ca" => $listCaHoc[array_rand($listCaHoc)]['code'], // Ca học ngẫu nhiên
    //                         ],
    //                         "hocSinh" => array_slice($studentsInClass, $currentStudentIndex, $phong['sucChua']),
    //                     ];

    //                     // Cập nhật chỉ số học sinh đã xếp vào lớp
    //                     $currentStudentIndex += $phong['sucChua'];
    //                     break; // Thoát vòng lặp khi đã xếp được một lớp
    //                 }
    //             }
    //         }
    //     }

    //     // Hiển thị kết quả
    //     // print_r($listLop);

    //     return response()->json($listLop);
    // }


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
        $chuyenNganh = ["CS", "SE", "IS"]; // Mã các chuyên ngành

        for ($i = 1; $i <= 2500; $i++) {
            // Chọn ngẫu nhiên chuyên ngành
            $randomIndex = array_rand($chuyenNganh);
            $randomChuyenNganh = $chuyenNganh[$randomIndex];

            $listHocSinh[] = [
                "maHS" => "HS$i",
                "ten" => "Học sinh $i",
                "chuyenNganh" => $randomChuyenNganh // Gán mã chuyên ngành ngẫu nhiên
            ];
        }

        return $listHocSinh;
    }

    private function generateClassrooms()
    {
        return [
            ["code" => "phong1", "name" => "Phòng 1", "sucChua" => 31],
            ["code" => "phong2", "name" => "Phòng 2", "sucChua" => 24],
            ["code" => "phong3", "name" => "Phòng 3", "sucChua" => 28],
            ["code" => "phong4", "name" => "Phòng 4", "sucChua" => 22],
            ["code" => "phong5", "name" => "Phòng 4", "sucChua" => 22],
            ["code" => "phong6", "name" => "Phòng 4", "sucChua" => 22],
            ["code" => "phong7", "name" => "Phòng 4", "sucChua" => 22],
            ["code" => "phong8", "name" => "Phòng 4", "sucChua" => 22],
            ["code" => "phong9", "name" => "Phòng 4", "sucChua" => 22],
            // ["code" => "phong10", "name" => "Phòng 4", "sucChua" => 22],
            // Thêm các phòng học khác...
            ["code" => "phong10", "name" => "Phòng 10", "sucChua" => 26]
        ];
    }

    private function generateSubjects()
    {
        return [
            ["code" => "MH101", "name" => "Toán đại cương", "tinChi" => 3, "chuyenNganh" => "CS"],
            ["code" => "MH102", "name" => "Lập trình cơ bản", "tinChi" => 3, "chuyenNganh" => "SE"],
            ["code" => "MH103", "name" => "Giải tích", "tinChi" => 4, "chuyenNganh" => "IS"],
            ["code" => "MH104", "name" => "Cấu trúc dữ liệu", "tinChi" => 3, "chuyenNganh" => "CS"],
            ["code" => "MH105", "name" => "Hệ điều hành", "tinChi" => 3, "chuyenNganh" => "SE"],
            ["code" => "MH106", "name" => "Mạng máy tính", "tinChi" => 3, "chuyenNganh" => "IS"],
            ["code" => "MH107", "name" => "Cơ sở dữ liệu", "tinChi" => 3, "chuyenNganh" => "CS"],
            ["code" => "MH108", "name" => "Khoa học máy tính", "tinChi" => 3, "chuyenNganh" => "SE"],
            ["code" => "MH109", "name" => "Xử lý tín hiệu", "tinChi" => 3, "chuyenNganh" => "IS"],
            ["code" => "MH110", "name" => "Thiết kế web", "tinChi" => 3, "chuyenNganh" => "SE"],
        ];
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

        foreach ($daysOfWeek as $day) {

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

                // Duyệt qua từng ngày trong tuần
                // Kiểm tra nếu đã xếp hết học sinh thì thoát
                if ($currentStudentIndex >= $totalStudents) {
                    break;
                }

                // Duyệt qua các phòng học
                foreach ($listPhonghoc as $phong) {
                    // Duyệt qua từng ca học từ 1 đến 7
                    foreach ($classTimes as $classTime) {
                        // Kiểm tra nếu đã xếp hết học sinh thì thoát
                        if ($currentStudentIndex >= $totalStudents) {
                            break;
                        }

                        $roomCapacity = $phong['sucChua']; // Sức chứa của phòng học
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
                            // "hocSinh" => array_slice($studentsInClass, $currentStudentIndex, $classSize), // Danh sách học sinh trong lớp
                        ];

                        // Cập nhật chỉ số học sinh đã xếp vào lớp
                        $currentStudentIndex += $classSize;

                        // Tăng bộ đếm lớp cho môn học
                        $classCounter++;
                    }
                    // Nếu đã xếp hết học sinh cho môn học này thì thoát khỏi vòng lặp phòng học
                    if ($currentStudentIndex >= $totalStudents) {
                        break;
                    }
                }
            }
        }

        return $listLop;
    }



    // private function assignClasses($listHocSinh, $listPhonghoc, $listMonHoc, $daysOfWeek)
    // {
    //     $listLop = []; // Danh sách lớp học đã xếp
    //     $classTimes = $this->generateClassTimes(); // Danh sách ca học

    //     // Duyệt qua từng môn học
    //     foreach ($listMonHoc as $mon) {
    //         // Bộ đếm lớp học cho mỗi môn
    //         $classCounter = 1;

    //         // Lọc danh sách học sinh theo chuyên ngành của môn học
    //         $studentsInClass = array_filter($listHocSinh, function ($hs) use ($mon) {
    //             return $hs['chuyenNganh'] === $mon['chuyenNganh']; // Lọc theo chuyên ngành
    //         });

    //         $currentStudentIndex = 0; // Chỉ số học sinh hiện tại
    //         $totalStudents = count($studentsInClass); // Tổng số học sinh cho môn này

    //         // Duyệt qua từng ngày trong tuần
    //         foreach ($daysOfWeek as $day) {
    //             // Kiểm tra nếu đã xếp hết học sinh thì thoát
    //             if ($currentStudentIndex >= $totalStudents) {
    //                 break;
    //             }

    //             // Duyệt qua các ca học từ 1 đến 7
    //             foreach ($classTimes as $classTime) {
    //                 // Duyệt qua từng phòng học trong mỗi ca
    //                 foreach ($listPhonghoc as $phong) {
    //                     // Kiểm tra nếu đã xếp hết học sinh thì thoát
    //                     if ($currentStudentIndex >= $totalStudents) {
    //                         break;
    //                     }

    //                     $roomCapacity = $phong['sucChua']; // Sức chứa của phòng học
    //                     // Số lượng học sinh tối đa trong lớp là sức chứa của phòng hoặc số học sinh còn lại
    //                     $classSize = min($roomCapacity, $totalStudents - $currentStudentIndex);

    //                     // Tạo tên lớp, ví dụ: "Lớp MH101 - 1"
    //                     $className = "Lớp " . $mon['code'] . " - " . $classCounter;

    //                     // Tạo lớp cho môn học trong phòng này, ngày này, ca này
    //                     $listLop[] = [
    //                         "tenLop" => $className, // Tên lớp
    //                         "monHoc" => $mon['code'],
    //                         "phongHoc" => $phong['code'],
    //                         "ngay" => $day['code'], // Ngày học
    //                         "ca" => $classTime['code'], // Ca học
    //                         // "hocSinh" => array_slice($studentsInClass, $currentStudentIndex, $classSize), // Danh sách học sinh trong lớp
    //                     ];

    //                     // Cập nhật chỉ số học sinh đã xếp vào lớp
    //                     $currentStudentIndex += $classSize;

    //                     // Tăng bộ đếm lớp cho môn học
    //                     $classCounter++;
    //                 }
    //             }
    //         }
    //     }

    //     return $listLop;
    // }





    private function generateClassTimes()
    {
        return [
            ["code" => "ca1", "name" => "Ca 1"],
            ["code" => "ca2", "name" => "Ca 2"],
            ["code" => "ca3", "name" => "Ca 3"],
            ["code" => "ca4", "name" => "Ca 4"],
            ["code" => "ca5", "name" => "Ca 5"],
            ["code" => "ca6", "name" => "Ca 6"],
            ["code" => "ca7", "name" => "Ca 7"]
        ];
    }
}
