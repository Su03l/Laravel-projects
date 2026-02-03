<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // 1. جدول المجموعات
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // اسم المجموعة
            $table->string('company_name')->nullable(); // اسم الشركة (اختياري)
            $table->text('description')->nullable(); // وصف للمجموعة

            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();

            // "المالك الأصلي" للمجموعة (عشان ما ينحذف الأدمن بالغلط)
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');

            $table->timestamps();
        });

        // 2. جدول الوسيط (الأعضاء)
        Schema::create('group_user', function (Blueprint $table) {
            $table->id();

            // ربط مع جدول المجموعات وجدول المستخدمين
            $table->foreignId('group_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // الدور داخل المجموعة (مهم جداً للصلاحيات)
            // القيم بتكون: 'admin' أو 'member'
            $table->string('role')->default('member');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_user');
        Schema::dropIfExists('groups');
    }
};
