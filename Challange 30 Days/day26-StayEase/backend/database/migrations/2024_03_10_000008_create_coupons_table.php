<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->enum('type', ['fixed', 'percent']);
            $table->decimal('value', 8, 2);
            $table->date('expires_at')->nullable();
            $table->integer('usage_limit')->nullable();
            $table->integer('used_count')->default(0);
            $table->timestamps();
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->string('coupon_code')->nullable();
            $table->decimal('discount_amount', 10, 2)->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['coupon_code', 'discount_amount']);
        });
        Schema::dropIfExists('coupons');
    }
};
