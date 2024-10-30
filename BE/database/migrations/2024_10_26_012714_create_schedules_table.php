<?php

use App\Models\Category;
use App\Models\Classroom;
use App\Models\Room;
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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->string('class_code',40)->comment('Mã lớp học');
            $table->foreign('class_code')->references('class_code')->on('classrooms')
                    ->cascadeOnDelete()->cascadeOnUpdate();

            $table->string('room_code',40)->comment('Mã phòng học');
            $table->foreign('room_code')->references('cate_code')->on('categories')
                    ->restrictOnDelete()->restrictOnUpdate();

            $table->string('session_code',40)->comment('Mã ca học');
            $table->foreign('session_code')->references('cate_code')->on('categories')
                    ->restrictOnDelete()->restrictOnUpdate();

            $table->date('date');
            $table->unique(['class_code', 'room_code', 'session_code', 'date']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};