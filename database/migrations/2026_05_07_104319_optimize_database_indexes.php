<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Add only missing indexes
        Schema::table('payments', function (Blueprint $table) {
            if (!Schema::hasColumn('payments', 'amount_paid')) return;
            // amount_paid is likely already there but maybe not indexed
            try {
                $table->index('amount_paid');
            } catch (\Exception $e) {}
        });
    }

    public function down()
    {
        Schema::table('payments', function (Blueprint $table) {
            try {
                $table->dropIndex(['amount_paid']);
            } catch (\Exception $e) {}
        });
    }
};
