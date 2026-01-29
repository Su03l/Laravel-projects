<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->date('date'); // تاريخ اليوم (عشان الفلترة السريعة)
            $table->time('check_in');
            $table->time('check_out')->nullable(); // نولابل لأنه لسه ما طلع

            // نحسب الساعات تلقائياً عند الخروج
            $table->decimal('work_hours', 4, 2)->nullable();

            // حالة (حاضر، غائب، متأخر) - بنخليها بسيطة حالياً
            $table->enum('status', ['present', 'absent', 'late'])->default('present');
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
