import paramiko

def fix_djauhar(host, user, password):
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

$t = \App\Models\Trader::where('name', 'DJAUHAR')->first();
if ($t) {
    echo "Found DJAUHAR. Permit number is: " . ($t->permit_number ?: 'NULL') . "\\n";
    $p = \App\Models\Permit::where('trader_id', $t->id)->first();
    if (!$p) {
        echo "Creating permit for DJAUHAR...\\n";
        $p = \App\Models\Permit::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'permit_number' => $t->permit_number ?: 'PMT-DJAUHAR123',
            'trader_id' => $t->id,
            'slot_id' => \App\Models\Slot::first()->id,
            'issued_at' => now(),
            'expires_at' => now()->addYear(),
            'status' => 'active',
            'qr_code_path' => 'TRADER-' . $t->id,
            'qr_code_payload' => 'TRADER-' . $t->id
        ]);
        if (!$t->permit_number) {
            $t->permit_number = 'PMT-DJAUHAR123';
            $t->save();
        }
    } else {
        echo "Permit exists with status: " . $p->status . "\\n";
        if ($p->status !== 'active') {
            $p->status = 'active';
            $p->save();
            echo "Updated permit status to active.\\n";
        }
    }
}
"""
        import base64
        encoded = base64.b64encode(script.encode()).decode()
        
        cmd = f"echo '{encoded}' | base64 -d > /tmp/check2.php && docker cp /tmp/check2.php svms-app-1:/tmp/check2.php && docker exec svms-app-1 php /tmp/check2.php"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode('utf-8', errors='replace'))
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    fix_djauhar("103.175.219.57", "root", "M4ruw4h3@")
