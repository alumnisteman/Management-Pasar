import paramiko

def optimize_indexes():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        
        migration_content = """<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('slots', function (Blueprint $table) {
            $table->index('code');
            $table->index('status');
            $table->index('category');
        });
        Schema::table('traders', function (Blueprint $table) {
            $table->index('nik');
            $table->index('status');
        });
        Schema::table('permits', function (Blueprint $table) {
            $table->index('status');
            $table->index('issued_at');
            $table->index('expires_at');
        });
        Schema::table('payments', function (Blueprint $table) {
            $table->index('status');
            $table->index('created_at');
        });
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->index('module');
            $table->index('action');
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::table('slots', function (Blueprint $table) {
            $table->dropIndex(['code']);
            $table->dropIndex(['status']);
            $table->dropIndex(['category']);
        });
        // ... other down methods if needed
    }
};
"""
        # Upload the migration content
        sftp = client.open_sftp()
        filename = "2026_05_07_104319_optimize_database_indexes.php"
        with sftp.file(f'/tmp/{filename}', 'w') as f:
            f.write(migration_content)
        
        # Move to correct location and run migration
        client.exec_command(f'docker cp /tmp/{filename} svms-app-1:/var/www/database/migrations/{filename}')
        stdin, stdout, stderr = client.exec_command('docker exec svms-app-1 php artisan migrate')
        print(stdout.read().decode().strip())
        print(stderr.read().decode().strip())
        
    finally:
        client.close()

if __name__ == "__main__":
    optimize_indexes()
