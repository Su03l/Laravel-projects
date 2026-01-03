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
        Schema::create('course_prerequisites', function (Blueprint $table) {
            $table->id();
            // المادة الأساسية (مثلاً فيزياء 2)
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            // المادة المطلوبة (مثلاً فيزياء 1)
            $table->foreignId('prerequisite_id')->constrained('courses')->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_prerequisites');
    }
};
