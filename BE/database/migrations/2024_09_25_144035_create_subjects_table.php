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
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string("subject");
            $table->decimal("tuition");
            $table->integer("credit_number");
            $table->string("number_study");
            $table->string("re_study_fee")->nullable();
            $table->string("image")->nullable();
            $table->string("description");
            $table->boolean("is_active")->default(true);
            $table->boolean("is_delete")->default(false);
            $table->string("semester");
            $table->string("major_code");
            $table->string("narrow_major_Code");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};
