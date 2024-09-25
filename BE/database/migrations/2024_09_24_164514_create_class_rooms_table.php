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
            $table->string('classCode',255)->unique();
            $table->string('className',255);
            $table->text('examScore',5000);
            $table->text('schoolSchedule',5000);
            $table->text('examSchdule',5000);
            $table->text('description',5000);
            $table->date('dateFrom');
            $table->date('dateTo');
            $table->text('student',5000);
            $table->boolean('isActive');
            $table->boolean('isDelete');
            $table->string('studyRoomCode',255);
            $table->string('subjectCode',255);
            $table->foreignId('userCode')->constrained();
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
