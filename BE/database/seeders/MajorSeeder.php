<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MajorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('majors')->insert([
            [
                'major_code' => 'CN01',
                'title' => 'Lập trình Web',
                'is_active' => 1,
                'description' => 'Lập trình Web',
                'image' => null,
                'parent_major_code' => 'CNH01',
                'type' => 'Kiểu 1'
            ],
            [
                'major_code' => 'CN02',
                'title' => 'Phát triển phần mềm',
                'is_active' => 1,
                'description' => 'Phát triển phần mềm',
                'image' => null,
                'parent_major_code' => 'CNH02',
                'type' => 'Kiểu 1'
            ],
            [
                'major_code' => 'CN03',
                'title' => 'Marketing',
                'is_active' => 1,
                'description' => 'Marketing',
                'image' => null,
                'parent_major_code' => 'CNH03',
                'type' => 'Kiểu 1'
            ]
        ]);
    }
}
