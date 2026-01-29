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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();

            $table->foreignId('client_id')->constrained()->onDelete('cascade');

            $table->foreignId('manager_id')->constrained('users')->onDelete('cascade');

            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('budget', 12, 2); // الميزانية (مثلاً 50,000.00)
            $table->enum('status', ['pending', 'active', 'completed', 'hold'])->default('pending');
            $table->date('start_date');
            $table->date('deadline');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
