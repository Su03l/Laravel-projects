<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();

            $table->uuid('uuid')->unique(); // رابط آمن للتذكرة (عشان ما أحد يخمن رقم التذكرة)
            $table->string('ref_id')->unique(); // رقم مرجعي للقراءة البشرية (مثال: #SUPPORT-2026-001)

            // العلاقات
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // صاحب التذكرة (العميل)
            $table->foreignId('category_id')->constrained(); // القسم
            $table->foreignId('assigned_to')->nullable()->constrained('users'); // الموظف المسؤول (قد تكون null في البداية)

            // المحتوى
            $table->string('title');
            $table->text('description');

            // الحقول الإدارية (Enums)
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('low');
            $table->enum('status', ['open', 'pending', 'resolved', 'closed'])->default('open');

            // السحر: حقول الـ SLA (اتفاقية مستوى الخدمة)
            $table->timestamp('sla_due_at')->nullable(); // متى لازم تنحل المشكلة؟
            $table->boolean('is_resolved')->default(false); // لتسهيل الفلترة
            $table->timestamp('resolved_at')->nullable(); // متى انحلت فعلياً؟

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
