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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sender_id')->nullable()->constrained('users');

            $table->foreignId('receiver_id')->constrained('users');

            $table->string('reference_id')->unique();
            $table->decimal('amount', 15, 2);
            $table->enum('type', ['transfer', 'deposit', 'withdraw']);
            $table->string('description')->nullable();
            $table->enum('status', ['success', 'failed'])->default('success');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
