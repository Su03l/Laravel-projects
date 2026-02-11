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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('users')->cascadeOnDelete(); // صاحب الكورس
            $table->string('title');
            $table->string('slug')->unique(); // SEO Friendly URL (e.g., /courses/learn-php)
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2)->default(0.00); // السعر (0 = مجاني)
            $table->string('thumbnail')->nullable(); // صورة الغلاف
            $table->boolean('is_published')->default(false); // مسودة أم منشور؟
            $table->timestamps();
            $table->softDeletes(); // SaaS Standard: لا تحذف شيئاً نهائياً
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
