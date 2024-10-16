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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('cate_code',191); // code của tất cả các bảng: major1
            $table->string('cate_name',50); // lap trinh web
            $table->string('parrent_code',50)->nullable();
            $table->text('value')->nullable();
            $table->string('image',1000)->nullable();
            $table->text('description')->nullable();
            $table->string('type'); // trường để phân biệt các bảng: chuyen nganh
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();
            // Thiết lập khóa ngoại cho parent_code để trỏ đến cate_code của danh mục cha
            $table->foreign('parrent_code')->references('cate_code')->on('categories')
            ->onDelete('cascade'); // Xóa danh mục cha sẽ xóa tất cả các danh mục con
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('categories');
    }
};
