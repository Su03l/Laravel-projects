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
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // الطالب
            $table->foreignId('course_id')->constrained()->cascadeOnDelete(); // الكورس
            $table->decimal('paid_amount', 10, 2); // المبلغ المدفوع (مهم للتقارير المالية)
            $table->timestamp('enrolled_at')->useCurrent();
            $table->timestamp('completed_at')->nullable(); // متى خلص الكورس؟

            $table->unique(['user_id', 'course_id']); // منع تكرار الشراء
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
