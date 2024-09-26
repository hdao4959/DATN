<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('categories')->insert([
            [
                'cate_code' => 'CN01',
                'cate_name' => 'Lập trình Web',
                'parrent_code' => 'CN01',
                'value' => null,
                'image' => null,
                'description' => null,
                'type' => 'Chuyên ngành',
                'is_active' => true
            ],
            [
                'cate_code' => 'CN02',
                'cate_name' => 'Lập trình Web',
                'parrent_code' => 'CN01',
                'value' => null,
                'image' => null,
                'description' => null,
                'type' => 'Môn học',
                'is_active' => true
            ],
            [
                'cate_code' => 'CN03',
                'cate_name' => 'Lập trình Web',
                'parrent_code' => 'CN01',
                'value' => null,
                'image' => null,
                'description' => null,
                'type' => 'Giao vien',
                'is_active' => true
            ]
        ]);
    }
}
