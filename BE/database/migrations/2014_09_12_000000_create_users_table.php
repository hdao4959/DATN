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
            $table->string('user_code', 191)->unique()->comment('Mã tài khoản');
            $table->index('user_code');
            $table->string('full_name', 50)->comment('Họ và tên');
            $table->string('email')->unique()->comment('Email');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->comment('Mật khẩu');
            $table->string('phone_number', 20)->comment('Số điện thoại');
            $table->string('address', 200)->comment('Địa chỉ');
            $table->string('sex', 20)->comment('Giới tính');
            $table->date('birthday')->comment('Ngày sinh');
            $table->string('citizen_card_number', 20)->comment('ID CCCD');
            $table->date('issue_date')->comment('Ngày cấp');
            $table->string('place_of_grant', 100)->comment('Nơi cấp');
            $table->string('nation', 50)->comment('Dân tộc');
            $table->string('avatar')->comment('Ảnh đại diện')->nullable();
            $table->enum('role', ['student', 'teacher', 'admin', 'sub_admin']);
            $table->boolean('is_active')->default(true);
            $table->string('major_code', 191)->comment('Mã ngành học');
            $table->foreign('major_code')->references('cate_code')->on('categories')->restrictOnDelete()->restrictOnUpdate();
            $table->string('narrow_major_code')->nullable()->comment('Mã chuyên ngành hẹp');
            $table->foreign('narrow_major_code')->references('cate_code')->on('categories')->nullOnDelete();
            $table->string('semester_code', 191)->comment('Mã kỳ học');
            $table->foreign('semester_code')->references('cate_code')->on('categories')->restrictOnDelete()->restrictOnUpdate();
            $table->string('course_code', 191)->comment('Mã khóa học');
            $table->foreign('course_code')->references('cate_code')->on('categories')->restrictOnDelete()->restrictOnUpdate();
            $table->index(['is_active','role', 'course_code', 'major_code', 'semester_code']);
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