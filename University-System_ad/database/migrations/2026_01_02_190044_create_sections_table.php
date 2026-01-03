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
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();

            $table->string('section_number');

            // الأيام: بنخليها ENUM عشان نضبط الجدول
            // STT = Sunday, Tuesday, Thursday
            // MW = Monday, Wednesday
            $table->enum('days', ['STT', 'MW']);

            // الوقت: مهم جداً نوعه يكون TIME عشان المقارنة
            $table->time('time_start');
            $table->time('time_end');

            $table->string('professor_name'); // اسم الدكتور
            $table->integer('capacity');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
