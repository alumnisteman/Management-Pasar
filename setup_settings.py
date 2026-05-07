import paramiko

def setup_settings():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        
        # Write PHP script to temporary file on server
        php_script = """<?php
        require 'vendor/autoload.php';
        $app = require_once 'bootstrap/app.php';
        $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
        $kernel->handle(Illuminate\Http\Request::capture());

        use Illuminate\Support\Facades\Schema;
        use Illuminate\Support\Facades\DB;

        if (!Schema::hasTable('settings')) {
            Schema::create('settings', function ($table) {
                $table->id();
                $table->string('key')->unique();
                $table->text('value')->nullable();
                $table->string('group')->default('general');
                $table->timestamps();
            });
            DB::table('settings')->insert([
                ['key' => 'permit_header_1', 'value' => 'PEMERINTAH KOTA TERNATE', 'group' => 'permit'],
                ['key' => 'permit_header_2', 'value' => 'DINAS PERINDUSTRIAN DAN PERDAGANGAN', 'group' => 'permit'],
                ['key' => 'permit_location', 'value' => 'MALUKU UTARA', 'group' => 'permit'],
                ['key' => 'permit_signatory_role', 'value' => 'Kepala Dinas Perindustrian dan Perdagangan', 'group' => 'permit'],
                ['key' => 'permit_signatory_name', 'value' => 'H. MUHAMMAD ALI, SE, M.Si', 'group' => 'permit'],
                ['key' => 'permit_signatory_nip', 'value' => '19720512 199803 1 005', 'group' => 'permit'],
            ]);
            echo "Settings table created and seeded.";
        } else {
            echo "Settings table already exists.";
        }
        """
        # Upload the script
        sftp = client.open_sftp()
        with sftp.file('/tmp/setup_settings.php', 'w') as f:
            f.write(php_script)
        
        # Run the script inside container
        client.exec_command('docker cp /tmp/setup_settings.php svms-app-1:/var/www/setup_settings.php')
        stdin, stdout, stderr = client.exec_command('docker exec svms-app-1 php setup_settings.php')
        print(stdout.read().decode().strip())
        print(stderr.read().decode().strip())
        
    finally:
        client.close()

if __name__ == "__main__":
    setup_settings()
