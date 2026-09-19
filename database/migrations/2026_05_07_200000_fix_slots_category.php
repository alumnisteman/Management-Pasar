<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('slots', function (Blueprint $table) {
            if (!Schema::hasColumn('slots', 'category')) {
                $table->string('category', 20)->default('umum')->after('code');
            }
            // Make position fields nullable so slots can be created without a position
            $table->char('zone_id', 36)->nullable()->change();
            $table->integer('x_position')->nullable()->change();
            $table->integer('y_position')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('slots', function (Blueprint $table) {
            if (Schema::hasColumn('slots', 'category')) {
                $table->dropColumn('category');
            }
        });
    }
};
