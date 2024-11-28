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
        Schema::create('scores', function (Blueprint $table) {
            $table->id();
            $table->string('student_code',20);
            $table->string('subject_code', 40);
            $table->foreign('subject_code')->references('subject_code')->on('subjects')
            ->cascadeOnDelete()->cascadeOnUpdate();
            $table->decimal('score', 5, 2)->comment('Điểm tổng hợp');
            $table->boolean('is_pass');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scores');
    }
};