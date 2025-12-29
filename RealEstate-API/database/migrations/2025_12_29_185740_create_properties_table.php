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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');

            $table->decimal('price', 10, 2);
            $table->integer('area');
            $table->integer('rooms');
            $table->integer('bathrooms');

            $table->string('city');
            $table->enum('type', ['apartment', 'villa', 'land']);
            $table->enum('status', ['sale', 'rent']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
