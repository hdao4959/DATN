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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->string('student_code')->index();
            $table->foreign('student_code')->references('user_code')->on('users')->cascadeOnDelete()->restrictOnUpdate();
            $table->string('class_code')->index();
            $table->foreign('class_code')->references('class_code')->on('classrooms')->cascadeOnDelete()->restrictOnUpdate();
            $table->dateTime('date');
            $table->enum('status', ['absent', 'present']);
            $table->string('noted')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
