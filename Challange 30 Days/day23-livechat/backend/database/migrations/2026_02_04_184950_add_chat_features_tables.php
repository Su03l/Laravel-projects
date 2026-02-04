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
        // 1. إضافة علامة "تم التعديل" في جدول الرسائل
        Schema::table('messages', function (Blueprint $table) {
            $table->boolean('is_edited')->default(false)->after('body');
        });

        // 2. جدول الرسائل المخفية (لخاصية "حذف لدي فقط")
        Schema::create('hidden_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('message_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // منع التكرار: المستخدم يخفي الرسالة مرة واحدة بس
            $table->unique(['user_id', 'message_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hidden_messages');
        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn('is_edited');
        });
    }
};
