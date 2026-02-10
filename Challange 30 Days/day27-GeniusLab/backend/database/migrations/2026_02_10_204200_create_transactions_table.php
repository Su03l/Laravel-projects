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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['deposit', 'usage']); // إيداع أو خصم
            $table->integer('credits'); // الكمية (موجب أو سالب)
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // إضافة عمود الرصيد للمستخدم (Cache) لسرعة الأداء
        Schema::table('users', function (Blueprint $table) {
            $table->integer('wallet_balance')->default(0); // الرصيد الحالي
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('wallet_balance');
        });
    }
};
