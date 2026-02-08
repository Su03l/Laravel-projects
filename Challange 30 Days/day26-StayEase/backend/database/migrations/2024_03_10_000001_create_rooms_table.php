<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_number')->unique();
            $table->integer('floor');

            $table->string('type');
            $table->string('view');
            $table->decimal('price_per_night', 10, 2);
            $table->integer('capacity_adults')->default(2);
            $table->integer('capacity_kids')->default(0);
            $table->integer('size_sqm')->nullable();

            $table->string('status')->default('available');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
