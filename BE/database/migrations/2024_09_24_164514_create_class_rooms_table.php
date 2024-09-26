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
            $table->string('classCode',255)->unique()->comment('Mã lớp');
            $table->string('className',255)->comment('Tên lớp');
            $table->text('examScore',5000)->comment('Json điểm thi');
            $table->text('schoolSchedule',5000)->comment('Json lịch học');
            $table->text('examSchdule',5000)->comment('Json lịch thi');
            $table->text('description',5000)->comment('Mô tả');
            $table->date('dateFrom')->comment('Từ ngày');
            $table->date('dateTo')->comment('Đến ngày');
            $table->text('student',5000)->comment('Json sinh viên');
            $table->boolean('isActive');
            $table->boolean('isDelete');
            $table->string('studyRoomCode',255)->comment('Phòng học');
            $table->string('subjectCode',255)->comment('Môn học');
            $table->foreignId('userCode')->constrained()->comment('Giáo viên');
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
