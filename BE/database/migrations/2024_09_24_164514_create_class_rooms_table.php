<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('class_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('class_code',255)->unique()->comment('Mã lớp');
            $table->string('class_name',255)->comment('Tên lớp');
            $table->integer('section')->comment('Ca học');
            $table->json('exam_score')->comment('Json điểm thi')->nullable();
            $table->json('study_schedule')->comment('Json lịch học');
            $table->json('exam_schedule')->comment('Json lịch thi')->nullable();
            $table->text('description')->comment('Mô tả')->nullable();
            $table->date('date_from')->comment('Ngày bắt đầu')->nullable();
            $table->date('date_to')->comment('Ngày kết thúc')->nullable();
            $table->json('students')->comment('Json sinh viên')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('room_code',255)->comment('Mã phòng học');
            $table->string('subject_code',255)->comment('Mã môn học');
            $table->foreignId('user_code')->comment('Giảng viên')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('class_rooms');
    }
};
