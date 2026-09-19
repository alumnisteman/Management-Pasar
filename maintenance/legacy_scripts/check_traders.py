import paramiko

def check(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        
        script = """
<?php
require '/var/www/vendor/autoload.php';
$app = require_once '/var/www/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$traders = \App\Models\Trader::with('permit')->get();
foreach ($traders as $t) {
    echo "Trader: {$t->name} (NIK: {$t->nik})\n";
    echo "  Permit Number: {$t->permit_number}\n";
    echo "  Has Permit Record: " . ($t->permit ? 'YES' : 'NO') . "\n";
    if ($t->permit) {
        echo "  Permit Status: {$t->permit->status}\n";
    }
}
"""
        import base64
        encoded = base64.b64encode(script.encode()).decode()
        
        cmd = f"echo '{encoded}' | base64 -d > /tmp/check.php && docker cp /tmp/check.php svms-app-1:/tmp/check.php && docker exec svms-app-1 php /tmp/check.php"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    check("103.175.219.57", "root", "M4ruw4h3@")
