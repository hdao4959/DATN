<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // DB::table('categories')->insert([
        //     [
        //         'cate_code' => 'CNTT011',
        //         'cate_name' => 'Lập trình',
        //         'value' => 1,
        //         'image' => 'uploads/image/cong_nghe_thong_tin.jpg',
        //         'description' => 'Chuyên ngành Lập trình',
        //         'parent_code' => null,
        //         'type' => 'major',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'cate_code' => 'CNTT021',
        //         'cate_name' => 'Lập trình phần mềm',
        //         'value' => 2,
        //         'image' => 'uploads/image/lap_trinh_phan_mem.jpg',
        //         'description' => 'Chuyên ngành lập trình phần mềm',
        //         'parent_code' => 'CNTT01',
        //         'type' => 'major',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'cate_code' => 'CNTT03',
        //         'cate_name' => 'Lập trình web HTML',
        //         'value' => 3,
        //         'image' => 'uploads/image/lap_trinh_web.jpg',
        //         'description' => 'Chuyên ngành lập trình web',
        //         'parent_code' => 'CNTT01',
        //         'type' => 'major',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'cate_code' => 'CNTT04',
        //         'cate_name' => 'Lập trình di động',
        //         'value' => 4,
        //         'image' => 'uploads/image/lap_trinh_di_dong.jpg',
        //         'description' => 'Chuyên ngành lập trình di động',
        //         'parent_code' => 'CNTT01',
        //         'type' => 'major',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'cate_code' => 'CNTT05',
        //         'cate_name' => 'Trí tuệ nhân tạo',
        //         'value' => 5,
        //         'image' => 'uploads/image/tri_tue_nhan_tao.jpg',
        //         'description' => 'Chuyên ngành trí tuệ nhân tạo',
        //         'parent_code' => 'CNTT01',
        //         'type' => 'major',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'cate_code' => 'CNTT06',
        //         'cate_name' => 'Cơ sở dữ liệu',
        //         'value' => 6,
        //         'image' => 'uploads/image/co_so_du_lieu.jpg',
        //         'description' => 'Chuyên ngành cơ sở dữ liệu',
        //         'parent_code' => 'CNTT01',
        //         'type' => 'major',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'cate_code' => 'CNTT07',
        //         'cate_name' => 'An toàn thông tin',
        //         'value' => 7,
        //         'image' => 'uploads/image/an_toan_thong_tin.jpg',
        //         'description' => 'Chuyên ngành an toàn thông tin',
        //         'parent_code' => 'CNTT01',
        //         'type' => 'major',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'cate_code' => 'CNTT08',
        //         'cate_name' => 'Phát triển phần mềm',
        //         'value' => 8,
        //         'image' => 'uploads/image/phat_trien_phan_mem.jpg',
        //         'description' => 'Chuyên ngành phát triển phần mềm',
        //         'parent_code' => 'CNTT01',
        //         'type' => 'major',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'cate_code' => 'CNTT09',
        //         'cate_name' => 'Phân tích dữ liệu',
        //         'value' => 9,
        //         'image' => 'uploads/image/phan_tich_du_lieu.jpg',
        //         'description' => 'Chuyên ngành phân tích dữ liệu',
        //         'parent_code' => 'CNTT01',
        //         'type' => 'major',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'cate_code' => 'CNTT10',
        //         'cate_name' => 'Mạng máy tính',
        //         'value' => 10,
        //         'image' => 'uploads/image/mang_may_tinh.jpg',
        //         'description' => 'Chuyên ngành mạng máy tính',
        //         'parent_code' => 'CNTT01',
        //         'type' => 'major',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        // ]);

        // DB::table('subjects')->insert([
        //     [
        //         'subject_code' => 'MH101',
        //         'subject_name' => 'Toán cao cấp',
        //         'tuition' => 5000000,
        //         're_study_fee' => 2000000,
        //         'credit_number' => 3,
        //         'total_sessions' => 45,
        //         'description' => 'Môn học về các khái niệm toán học cao cấp',
        //         'image' => 'toan_cao_cap.jpg',
        //         'semester_code' => 'S01',
        //         'major_code' => 'CNTT01',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'subject_code' => 'MH102',
        //         'subject_name' => 'Lập trình web',
        //         'tuition' => 6000000,
        //         're_study_fee' => 2500000,
        //         'credit_number' => 4,
        //         'total_sessions' => 50,
        //         'description' => 'Môn học về phát triển web',
        //         'image' => 'lap_trinh_web.jpg',
        //         'semester_code' => 'S01',
        //         'major_code' => 'CNTT01',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'subject_code' => 'MH103',
        //         'subject_name' => 'Lập trình hướng đối tượng',
        //         'tuition' => 5500000,
        //         're_study_fee' => 2300000,
        //         'credit_number' => 3,
        //         'total_sessions' => 45,
        //         'description' => 'Môn học về lập trình hướng đối tượng',
        //         'image' => 'lap_trinh_hdt.jpg',
        //         'semester_code' => 'S01',
        //         'major_code' => 'CNTT01',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'subject_code' => 'MH104',
        //         'subject_name' => 'Cơ sở dữ liệu',
        //         'tuition' => 5800000,
        //         're_study_fee' => 2400000,
        //         'credit_number' => 4,
        //         'total_sessions' => 48,
        //         'description' => 'Môn học về cơ sở dữ liệu và quản trị dữ liệu',
        //         'image' => 'co_so_du_lieu.jpg',
        //         'semester_code' => 'S01',
        //         'major_code' => 'CNTT01',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'subject_code' => 'MH105',
        //         'subject_name' => 'Lập trình di động',
        //         'tuition' => 6500000,
        //         're_study_fee' => 2700000,
        //         'credit_number' => 5,
        //         'total_sessions' => 55,
        //         'description' => 'Môn học về phát triển ứng dụng di động',
        //         'image' => 'lap_trinh_di_dong.jpg',
        //         'semester_code' => 'S01',
        //         'major_code' => 'CNTT01',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'subject_code' => 'MH106',
        //         'subject_name' => 'Mạng máy tính',
        //         'tuition' => 5900000,
        //         're_study_fee' => 2500000,
        //         'credit_number' => 4,
        //         'total_sessions' => 48,
        //         'description' => 'Môn học về kiến trúc mạng và quản trị hệ thống mạng',
        //         'image' => 'mang_may_tinh.jpg',
        //         'semester_code' => 'S01',
        //         'major_code' => 'CNTT01',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'subject_code' => 'MH107',
        //         'subject_name' => 'Trí tuệ nhân tạo',
        //         'tuition' => 7000000,
        //         're_study_fee' => 3000000,
        //         'credit_number' => 5,
        //         'total_sessions' => 60,
        //         'description' => 'Môn học về trí tuệ nhân tạo và học máy',
        //         'image' => 'tri_tue_nhan_tao.jpg',
        //         'semester_code' => 'S01',
        //         'major_code' => 'CNTT01',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'subject_code' => 'MH108',
        //         'subject_name' => 'Phát triển phần mềm',
        //         'tuition' => 6300000,
        //         're_study_fee' => 2600000,
        //         'credit_number' => 4,
        //         'total_sessions' => 50,
        //         'description' => 'Môn học về phát triển phần mềm và quy trình xây dựng phần mềm',
        //         'image' => 'phat_trien_phan_mem.jpg',
        //         'semester_code' => 'S01',
        //         'major_code' => 'CNTT01',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'subject_code' => 'MH109',
        //         'subject_name' => 'Phân tích dữ liệu',
        //         'tuition' => 6200000,
        //         're_study_fee' => 2700000,
        //         'credit_number' => 4,
        //         'total_sessions' => 48,
        //         'description' => 'Môn học về phân tích và xử lý dữ liệu lớn',
        //         'image' => 'phan_tich_du_lieu.jpg',
        //         'semester_code' => 'S01',
        //         'major_code' => 'CNTT01',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        //     [
        //         'subject_code' => 'MH110',
        //         'subject_name' => 'An toàn thông tin',
        //         'tuition' => 6100000,
        //         're_study_fee' => 2500000,
        //         'credit_number' => 4,
        //         'total_sessions' => 45,
        //         'description' => 'Môn học về bảo mật và an toàn thông tin',
        //         'image' => 'an_toan_thong_tin.jpg',
        //         'semester_code' => 'S01',
        //         'major_code' => 'CNTT01',
        //         'is_active' => 1,
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        // ]);


        // Thêm admin
        // DB::table('users')->insert([
        //     [
        //         'user_code' => 'admin01',
        //         'full_name' => 'Admin',
        //         'email' => 'admin@example.com',
        //         'email_verified_at' => now(),
        //         'password' => bcrypt('password'),
        //         'phone_number' => '0123456789',
        //         'address' => '123 Admin Street',
        //         'sex' => 'Nam',
        //         'birthday' => '1990-01-01',
        //         'citizen_card_number' => '123456789',
        //         'issue_date' => '2020-01-01',
        //         'place_of_grant' => 'Hà Nội',
        //         'nation' => 'Kinh',
        //         'avatar' => null,
        //         'role' => 'admin',
        //         'is_active' => 1,
        //         'major_code' => 'CNTT01',
        //         'narrow_major_code' => null,
        //         'semester_code' => 'S01',
        //         'course_code' => 'k18',
        //         'remember_token' => Str::random(10),
        //         'deleted_at' => null,
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ],
        // ]);

        // Thêm 10 giáo viên
        // for ($i = 10; $i <= 100; $i++) {
        //     DB::table('users')->insert([
        //         [
        //             'user_code' => 'teacher' . sprintf('%02d', $i), // teacher01, teacher02, ...
        //             'full_name' => 'Teacher ' . $i,
        //             'email' => 'teacher' . $i . '@example.com',
        //             'email_verified_at' => now(),
        //             'password' => bcrypt('password123'),
        //             'phone_number' => '01234567' . sprintf('%02d', $i),
        //             'address' => '123 Teacher Street',
        //             'sex' => $i % 2 == 0 ? 'Nữ' : 'Nam', // Đặt giới tính ngẫu nhiên
        //             'birthday' => '1985-01-0' . ($i % 10 + 1), // Ngày sinh ngẫu nhiên
        //             'citizen_card_number' => '12345678' . $i,
        //             'issue_date' => '2020-01-01',
        //             'place_of_grant' => 'Hà Nội',
        //             'nation' => 'Kinh',
        //             'avatar' => null,
        //             'role' => 'teacher',
        //             'is_active' => 1,
        //             'major_code' => 'CNTT01',
        //             'narrow_major_code' => null,
        //             'semester_code' => 'S01',
        //             'course_code' => 'k18',
        //             'remember_token' => Str::random(10),
        //             'deleted_at' => null,
        //             'created_at' => Carbon::now(),
        //             'updated_at' => Carbon::now(),
        //         ],
        //     ]);
        // }

        // Thêm 20 sinh viên
        $majorCodes = ['CN01', 'CN03', 'CN04', 'CN0003'];
        $narrowMajorCodes = ['CN04', 'CNTT01'];
        $semesterCodes = ['S01', 'S02', 'S03', 'S04','S05','S06','S07'];

        for ($i = 1; $i <= 30; $i++) {
            DB::table('subjects')->insert([
                [
                    'subject_code' => 'MH' . sprintf('%03d', $i),
                    'subject_name' => 'Môn học ' . $i,
                    'tuition' => rand(5000000, 7000000), // Học phí ngẫu nhiên trong khoảng từ 5-7 triệu
                    're_study_fee' => rand(2000000, 3000000), // Phí học lại ngẫu nhiên
                    'credit_number' => rand(3, 5), // Số tín chỉ ngẫu nhiên từ 3 đến 5
                    'total_sessions' => rand(15, 20), // Tổng số buổi học ngẫu nhiên
                    'description' => 'Mô tả môn học ' . $i,
                    'image' => 'mon_hoc_' . $i . '.jpg', // Tên ảnh cho mỗi môn học
                    'semester_code' => $semesterCodes[array_rand($semesterCodes)],
                    'major_code' => $majorCodes[array_rand($majorCodes)], // Chọn ngẫu nhiên mã ngành
                    'is_active' => 1,
                    'deleted_at' => null,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ],
            ]);
        }
        
        // for ($i = 50; $i <= 1500; $i++) {
        //     DB::table('users')->insert([
        //         [
        //             'user_code' => 'student' . sprintf('%02d', $i), // student01, student02, ...
        //             'full_name' => 'Student ' . $i,
        //             'email' => 'student' . $i . '@example.com',
        //             'email_verified_at' => now(),
        //             'password' => bcrypt('password123'),
        //             'phone_number' => '01234567' . sprintf('%02d', $i),
        //             'address' => '123 Student Street',
        //             'sex' => $i % 2 == 0 ? 'Nữ' : 'Nam', // Đặt giới tính ngẫu nhiên
        //             'birthday' => '2000-01-0' . ($i % 10 + 1), // Ngày sinh ngẫu nhiên
        //             'citizen_card_number' => '12345678' . $i,
        //             'issue_date' => '2020-01-01',
        //             'place_of_grant' => 'Hà Nội',
        //             'nation' => 'Kinh',
        //             'avatar' => null,
        //             'role' => 'student',
        //             'is_active' => 1,
        //             'major_code' => $majorCodes[array_rand($majorCodes)], // Chọn ngẫu nhiên mã ngành
        //             'narrow_major_code' => $narrowMajorCodes[array_rand($narrowMajorCodes)], // Chọn ngẫu nhiên narrow_major_code
        //             'semester_code' => $semesterCodes[array_rand($semesterCodes)],
        //             'course_code' => 'k18',
        //             'remember_token' => Str::random(10),
        //             'deleted_at' => null,
        //             'created_at' => Carbon::now(),
        //             'updated_at' => Carbon::now(),
        //         ],
        //     ]);
        // }
    }
}
