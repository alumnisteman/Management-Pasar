import paramiko

def touch_djauhar(host, user, password):
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

$permit = \App\Models\Permit::whereHas('trader', function($q) {
    $q->where('name', 'DJAUHAR');
})->first();

if ($permit) {
    $permit->updated_at = now();
    $permit->created_at = now(); // Just in case it's still sorting by created_at
    $permit->save();
    echo "Successfully touched DJAUHAR's permit timestamps to now().\\n";
} else {
    echo "Permit not found for DJAUHAR.\\n";
}
"""
        import base64
        encoded = base64.b64encode(script.encode()).decode()
        
        cmd = f"echo '{encoded}' | base64 -d > /tmp/touch.php && docker cp /tmp/touch.php svms-app-1:/tmp/touch.php && docker exec svms-app-1 php /tmp/touch.php"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    touch_djauhar("103.175.219.57", "root", "M4ruw4h3@")
