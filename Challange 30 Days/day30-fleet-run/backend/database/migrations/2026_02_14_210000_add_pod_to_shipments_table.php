<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shipments', function (Blueprint $table) {
            $table->string('proof_of_delivery_path')->nullable()->after('status');
            $table->timestamp('delivered_at')->nullable()->after('proof_of_delivery_path');
        });
    }

    public function down(): void
    {
        Schema::table('shipments', function (Blueprint $table) {
            $table->dropColumn(['proof_of_delivery_path', 'delivered_at']);
        });
    }
};
