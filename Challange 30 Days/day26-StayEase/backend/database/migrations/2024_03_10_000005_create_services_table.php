<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 8, 2);
            $table->string('category');
            $table->string('image')->nullable();
            $table->timestamps();
        });

        Schema::create('booking_service', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_id')->constrained();

            $table->integer('quantity')->default(1);
            $table->decimal('price_at_order', 8, 2);
            $table->string('status')->default('ordered');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_service');
        Schema::dropIfExists('services');
    }
};
