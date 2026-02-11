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
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chapter_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug');
            $table->text('content')->nullable(); // وصف أو محتوى نصي
            $table->string('video_url')->nullable(); // رابط الفيديو (S3 or Vimeo)
            $table->integer('duration_minutes')->default(0); // مدة الدرس (لحساب التقدم)
            $table->integer('sort_order')->default(0); // ترتيب الدرس داخل القسم
            $table->boolean('is_free_preview')->default(false); // هل يمكن مشاهدته مجاناً؟ (SaaS Feature)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
