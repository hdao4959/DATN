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

        \App\Models\User::factory()->create([
            'user_code' => 'ad00001',
            'full_name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => 'password'
        ]);
    }
}
