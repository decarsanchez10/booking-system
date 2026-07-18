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
        Schema::table('appointments', function (Blueprint $table) {
            $table->index('status');
            $table->index('appointment_date');
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->index('status');
        });

        Schema::table('chat_messages', function (Blueprint $table) {
            $table->index('is_read');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['appointment_date']);
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('chat_messages', function (Blueprint $table) {
            $table->dropIndex(['is_read']);
        });
    }
};
