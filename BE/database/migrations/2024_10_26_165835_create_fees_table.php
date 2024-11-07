<?php

use App\Models\Category;
use App\Models\User;
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
        Schema::create('fees', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained();
            $table->string('user_code');
            $table->integer('semester');
            $table->decimal('amount',10,2);
            $table->date('start_date');
            $table->date('due_date');
            $table->enum('status', ['pending','paid','unpaid'])->default('pending');
            $table->timestamps();
        });
    }
    // fees: 	fee_id
	// student_id
	// amount:		(số tiền phải đóng)
	// overpaid_amount
	// start_date:	(ngày bắt đầu)
	// due_date:	(ngày hạn đóng)
	// status: 	(trạng thái)
	// paid_date:

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fees');
    }
};
