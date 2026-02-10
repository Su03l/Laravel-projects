<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ai_models', function (Blueprint $table) {
            // نضيف نوع الموديل: نصي، صور، صوتي
            $table->enum('type', ['text', 'image', 'audio'])->default('text')->after('api_slug');
        });
    }

    public function down(): void
    {
        Schema::table('ai_models', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
