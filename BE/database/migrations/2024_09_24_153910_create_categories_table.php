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
            $table->string('cateCode',255)->unique();
            $table->string('cateName',50);
            $table->string('parrentCode',50)->nullable();
            $table->text('value')->nullable();
            $table->string('image',1000)->nullable();
            $table->text('description')->nullable();
            $table->boolean('isActive')->default(true);
            $table->boolean('isDelete')->default(false);
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
        Schema::dropIfExists('categories');
    }
};
