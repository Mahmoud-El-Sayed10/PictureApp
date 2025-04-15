<?php // database/migrations/xxxx_add_geolocation_to_login_histories_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('login_histories', function (Blueprint $table) {
            $table->string('city')->nullable()->after('user_agent');
            $table->string('country_iso_code', 10)->nullable()->after('city');
            $table->string('country_name')->nullable()->after('country_iso_code');
        });
    }

    public function down(): void
    {
        Schema::table('login_histories', function (Blueprint $table) {
            $table->dropColumn(['country_name', 'country_iso_code', 'city']);
        });
    }
};