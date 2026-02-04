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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();

            $table->boolean('is_group')->default(false);
            $table->string('group_name')->nullable();
            $table->string('group_image')->nullable();
            $table->foreignId('admin_id')->nullable()->constrained('users');

            $table->boolean('is_locked')->default(false);
            $table->boolean('is_phone_hidden')->default(false);

            $table->text('last_message_preview')->nullable();
            $table->timestamp('last_message_at')->nullable();
            $table->softDeletes();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
