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
        Schema::create('newsletters', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('title');
            $table->string('tags')->nullable();
            $table->text('content');
            $table->string('image',1000)->nullable();
            $table->text('description')->nullable();
            $table->string('type');
            $table->string('order')->nullable();
            $table->date('expiry_date')->nulllable();
            $table->boolean('is_active')->default(true);
            $table->string('user_code');
            $table->foreign('user_code')->references('user_code')->on('users')->cascadeOnDelete()->restrictOnUpdate();
            $table->string('cate_code');            
            $table->foreign('cate_code')->references('cate_code')->on('categories')->cascadeOnDelete()->restrictOnUpdate();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('newsletters');
    }
};