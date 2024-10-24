<?php

use App\Models\Subject;
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
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();
            $table->string('class_code',255)->unique()->comment('Mã lớp');
            $table->index('class_code');
            $table->string('class_name',255)->comment('Tên lớp');
<<<<<<< HEAD
            $table->integer('section')->comment('Ca học');
            $table->json('score')->comment('Json điểm thi')->nullable();
=======
            $table->text('description')->comment('Mô tả')->nullable();
            $table->json('exam_score')->comment('Json điểm thi')->nullable();
>>>>>>> 93a8d961f5b142596055baabc17467c6fcc3f1ba
            $table->json('study_schedule')->comment('Json lịch học');
            $table->json('exam_schedule')->comment('Json lịch thi')->nullable();
            $table->json('students')->comment('Json sinh viên')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('section_code',255)->comment('Ca học');
            $table->foreign('section_code')->references('cate_code')->on('categories')->restrictOnDelete ();
            $table->string('room_code',191)->comment('Mã phòng học');
            $table->foreign('room_code')->references('cate_code')->on('categories')->restrictOnDelete();
            $table->foreignIdFor(Subject::class)->comment('Môn học')->constrained()->onDelete('cascade');
            $table->string('user_code',191)->comment('Giảng viên')->nullable();
            $table->foreign('user_code')->references('user_code')->on('users')->nullOnDelete();
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
