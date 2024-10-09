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
            $table->string('subject_code',255);
            $table->string('subject_name',255);
            $table->decimal('tuition', 8, 2);
            $table->decimal('re_study_fee', 8, 2);
            $table->integer('credit_number');
            $table->integer('number_study');
            $table->text('exam_day');
            $table->text('description');
            $table->string('image',1000);
            $table->boolean('is_active');
            $table->boolean('is_delete');
            $table->string('semester_code',255);
            $table->string('major_code',255);
            $table->string('narrow_major_code',255);
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
