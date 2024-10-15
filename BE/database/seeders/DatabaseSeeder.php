<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(1)->create();

        // \App\Models\User::factory(1000)->create([
        //     'user_code' => 'PH' . fake()->unique()->numberBetween(100, 999), // Tạo mã sinh viên ngẫu nhiên ST100 - ST999
        //     'full_name' => fake()->name,
        //     'email' => fake()->unique()->safeEmail,
        //     'password' => bcrypt('password'), // Mật khẩu mẫu
        //     'phone_number' => fake()->phoneNumber,
        //     'address' => fake()->address,
        //     'sex' => fake()->randomElement(['male', 'female']),
        //     'birthday' => fake()->date(),
        //     'citizen_card_number' => fake()->unique()->numerify('###########'),
        //     'issue_date' => fake()->date(),
        //     'place_of_grant' => fake()->city,
        //     'nation' => fake()->country,
        //     'avatar' => fake()->imageUrl(200, 200, 'people'), // URL avatar ngẫu nhiên
        //     'role' => 'student', // Mặc định role là student
        //     'is_active' => 1,
        // ]);

        for ($i = 1; $i <= 1000; $i++) {
            \App\Models\User::create([
                'user_code' => 'ST' . str_pad($i, 5, '0', STR_PAD_LEFT), // Tạo user_code dạng ST00001, ST00002,...
                'full_name' => 'Student ' . $i,
                'email' => 'student' . $i . '@example.com',
                'password' => bcrypt('password'), // Mã hóa password
                'phone_number' => '(123) 456-789' . $i, // Số điện thoại giả
                'address' => 'Address ' . $i,
                'sex' => 'Other', // Thay đổi theo nhu cầu
                'birthday' => '2000-01-01', // Ngày sinh giả
                'citizen_card_number' => 'CCN' . $i, // Số thẻ công dân giả
                'issue_date' => '2024-01-01', // Ngày cấp giả
                'place_of_grant' => 'Place ' . $i,
                'nation' => 'Nation ' . $i,
                'avatar' => 'https://via.placeholder.com/200x200.png?text=Avatar+' . $i,
                'role' => 'student',
                'is_active' => 1,
            ]);
        }
    
    }
}
