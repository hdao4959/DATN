<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(1000)->create();

        User::create([
            'user_code' => 'AM' . fake()->unique()->numberBetween(100, 999), // Tạo mã sinh viên ngẫu nhiên ST100 - ST999
            'full_name' => fake()->name,
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'), // Mật khẩu mẫu
            'phone_number' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'sex' => fake()->randomElement(['male', 'female']),
            'birthday' => fake()->date(),
            'citizen_card_number' => fake()->unique()->numerify('###########'),
            'issue_date' => fake()->date(),
            'place_of_grant' => fake()->city,
            'nation' => 'Kinh',
            'avatar' => fake()->imageUrl(200, 200, 'people'), // URL avatar ngẫu nhiên
            'role' => 'admin', // Mặc định role là student
            'major_code' => 'CN01',
            'semester_code' => 'S01',
            'course_code' => 'K01',
            'is_active' => 1,
        ]);

      
    
    }
}
