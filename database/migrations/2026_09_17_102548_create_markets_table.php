<?php

/**
 * No-op migration for markets table to satisfy Laravel migration history.
 */
return new class extends \Illuminate\Database\Migrations\Migration {
    public function up(): void {}
    public function down(): void {}
};
?>
