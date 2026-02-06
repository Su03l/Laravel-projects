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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('ticket_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained(); // كاتب الرد

            // المحتوى
            $table->text('body');

            // الميزة الاحترافية: هل هي ملاحظة داخلية؟
            // الافتراضي false (يعني رد عام يشوفه العميل)
            $table->boolean('is_internal')->default(false);

            // مستقبلاً للمرفقات (صورة المشكلة)
            $table->string('attachment_path')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
