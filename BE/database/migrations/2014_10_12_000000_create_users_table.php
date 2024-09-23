<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('user_code')->unique();
            $table->string('full_name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone_number');
            $table->string('address');
            $table->string('sex');
            $table->date('birthday');
            $table->string('id_identity')->comment('ID CCCD');
            $table->string('issue_date')->comment('Ngày cấp');
            $table->string('place_of_grant')->comment('Nơi cấp');
            $table->string('nation')->comment('Quốc gia');
            $table->text('avatar')->comment('Ảnh đại diện')->nullable();
            $table->enum('role',['student', 'teacher', 'admin', 'sub_admin']);
            $table->boolean('is_active')->default(true);
            $table->rememberToken();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
