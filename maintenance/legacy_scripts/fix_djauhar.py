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

$traders = \App\Models\Trader::all();
foreach ($traders as $trader) {
    if (!$trader->permit_number) {
        $trader->permit_number = 'PMT-' . strtoupper(\Illuminate\Support\Str::random(8));
        $trader->save();
    }
    
    $permit = \App\Models\Permit::where('trader_id', $trader->id)->first();
    if (!$permit) {
        // Just find ANY slot if needed, or don't set slot_id
        $slot_id = \App\Models\Slot::first()->id ?? null;
        
        \App\Models\Permit::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'permit_number' => $trader->permit_number,
            'trader_id' => $trader->id,
            'slot_id' => $slot_id,
            'issued_at' => now(),
            'expires_at' => now()->addYear(),
            'status' => 'active',
            'qr_code_path' => 'TRADER-' . $trader->id
        ]);
        echo "Created permit for {$trader->name}\n";
    }
}
echo "Done fixing permits.\n";
"""
        import base64
        encoded = base64.b64encode(script.encode()).decode()
        
        cmd = f"echo '{encoded}' | base64 -d > /tmp/fix.php && docker cp /tmp/fix.php svms-app-1:/tmp/fix.php && docker exec svms-app-1 php /tmp/fix.php"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode('utf-8', errors='replace'))
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    fix_djauhar("103.175.219.57", "root", "M4ruw4h3@")
