<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('two_factor_enabled')->default(false); // تفعيل المصادقة الثنائية
            $table->string('otp_code')->nullable(); // كود التحقق
            $table->timestamp('otp_expires_at')->nullable(); // وقت انتهاء الكود
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['two_factor_enabled', 'otp_code', 'otp_expires_at']);
        });
    }
};
