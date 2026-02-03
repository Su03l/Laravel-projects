<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            // 1. التفاصيل الأساسية
            $table->string('title'); // عنوان المهمة
            $table->text('content')->nullable(); // الوصف (اختياري)
            $table->boolean('is_completed')->default(false); // الحالة (مكتملة أم لا)

            // 2. الأولوية (مهم للفلترة)
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');

            // 3. التواريخ
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();


            // أ. المنشئ (صاحب التاسك)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // ب. المجموعة (اختياري)
            // إذا كانت null = تاسك شخصي
            // إذا فيها رقم = تاسك تابع لمجموعة
            $table->foreignId('group_id')->nullable()->constrained()->onDelete('cascade');

            // ج. الشخص المكلف (اختياري)
            // في التاسك الشخصي ممكن يكون فاضي، وفي المجموعة نحدد مين يمسكه
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
