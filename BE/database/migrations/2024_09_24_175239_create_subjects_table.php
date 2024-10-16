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
            $table->string('subject_code',255)->unique();
            $table->string('subject_name',255)->unique();
            $table->decimal('tuition', 8, 2)->nullable();
            $table->decimal('re_study_fee', 8, 2)->nullable();
            $table->integer('credit_number')->nullable();
            $table->integer('number_study');
            $table->text('exam_day')->nullable();
            $table->text('description')->nullable();
            $table->string('image',1000)->nullable();
            $table->string('semester_code',255);
            $table->string('major_code',255);
            $table->string('narrow_major_code',255);
            $table->boolean('is_active')->default(true);
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
        Schema::dropIfExists('subjects');
    }
};
