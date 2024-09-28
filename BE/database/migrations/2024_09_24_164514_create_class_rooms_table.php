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
            $table->json('exam_score')->comment('Json điểm thi');
            $table->json('school_schedule')->comment('Json lịch học');
            $table->json('exam_schedule')->comment('Json lịch thi');
            $table->text('description')->comment('Mô tả');
            $table->date('date_from')->comment('Ngày bắt đầu');
            $table->date('date_to')->comment('Ngày kết thúc');
            $table->json('students')->comment('Json sinh viên');
            $table->boolean('is_active');
            $table->string('study_room_code',255)->comment('Mã phòng học');
            $table->string('subject_code',255)->comment('Mã môn học');
            $table->foreignId('user_code')->comment('Giảng viên');
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
