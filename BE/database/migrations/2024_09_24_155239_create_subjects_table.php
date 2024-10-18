<?php

use App\Models\Category;
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
            $table->string('subject_code',191)->unique()->comment('Mã môn học');
            $table->index('subject_code');
            $table->string('subject_name',255)->unique()->comment('Tên môn học');
            $table->decimal('tuition', 8, 2)->nullable()->comment('Học phí');
            $table->decimal('re_study_fee', 8, 2)->nullable()->comment('Phí học lại');
            $table->integer('credit_number')->nullable()->comment("Số tín chỉ");
            $table->integer('total_sessions')->comment('Tổng số buổi học');
            $table->text('description')->nullable();
            $table->string('image',1000)->nullable();
            $table->string('semester_code',191)->comment('Mã kì học');
            $table->foreign('semester_code')->references('cate_code')->on('categories')->restrictOnDelete()->restrictOnUpdate();
            $table->string('major_code',191)->comment('Mã chuyên ngành');
            $table->foreign('major_code')->references('cate_code')->on('categories')->restrictOnDelete()->restrictOnUpdate();
            $table->boolean('is_active')->default(true);
            $table->index(['is_active', 'major_code', 'semester_code']);
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
