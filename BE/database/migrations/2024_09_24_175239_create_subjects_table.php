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
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('subjectCode',255);
            $table->string('subjectName',255);
            $table->decimal('tuition', 8, 2);
            $table->decimal('reStudyFee', 8, 2);
            $table->integer('creditNumber');
            $table->integer('numberStudy');
            $table->text('examDay');
            $table->text('description');
            $table->string('image',1000);
            $table->boolean('isActive');
            $table->boolean('isDelete');
            $table->string('semesterCode',255);
            $table->string('majorCode',255);
            $table->string('narrowMajorCode',255);
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
        Schema::dropIfExists('subjects');
    }
};
