<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // اسم الأداة: Blog Post Generator
            $table->string('icon')->nullable(); // أيقونة: 📝
            $table->string('description'); // وصف: Create SEO optimized articles
            $table->text('prompt_pattern'); // السر هنا: "Write a blog post about {topic} with {tone} tone."
            $table->json('fields'); // الحقول المطلوبة: [{'name': 'topic', 'type': 'text'}, {'name': 'tone', 'type': 'select'}]
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_templates');
    }
};
