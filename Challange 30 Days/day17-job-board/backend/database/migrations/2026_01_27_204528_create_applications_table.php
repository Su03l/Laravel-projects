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
        Schema::create('applications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // المتقدم
            $table->foreignId('job_id')->constrained()->onDelete('cascade');  // الوظيفة

            $table->text('cover_letter')->nullable(); // رسالة الغلاف
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');

            // منع التقديم مرتين على نفس الوظيفة
            $table->unique(['user_id', 'job_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
