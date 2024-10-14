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
            $table->string('user_code',190)->unique()->comment('Mã người dùng');
            $table->string('full_name',50)->comment('Họ và tên');
            $table->string('email')->unique()->comment('Email');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password',191)->comment('Mật khẩu');
            $table->string('phone_number',20)->comment('Số điện thoại');
            $table->string('address',200)->comment('Địa chỉ');
            $table->string('sex',20)->comment('Giới tính');
            $table->date('birthday')->comment('Ngày sinh');
            $table->string('citizen_card_number',20)->comment('ID CCCD');
            $table->date('issue_date')->comment('Ngày cấp');
            $table->string('place_of_grant',100)->comment('Nơi cấp');
            $table->string('nation',50)->comment('Dân tộc');
            $table->text('avatar')->comment('Ảnh đại diện')->nullable();
            $table->enum('role',['student', 'teacher', 'admin', 'sub_admin']);
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('majors_id')->nullable()->comment('Ngành học');
            $table->unsignedBigInteger('class_id')->nullable()->comment('Lớp học');
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
