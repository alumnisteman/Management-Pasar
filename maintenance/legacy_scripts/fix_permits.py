import paramiko

def fix_permits(host, user, password):
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
$count = 0;
foreach ($traders as $trader) {
    if (!$trader->permit_number) {
        $trader->permit_number = 'PMT-' . strtoupper(\Illuminate\Support\Str::random(8));
        $trader->save();
    }
    
    $permit = \App\Models\Permit::where('trader_id', $trader->id)->first();
    if (!$permit) {
        $slot_id = $trader->slot_id ?? \App\Models\Slot::where('status', 'occupied')->orWhere('status', 'active')->first()->id ?? null;
        
        if ($slot_id) {
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
            $count++;
            echo "Created permit for {$trader->name}\n";
        }
    }
}
echo "Done. Created $count missing permits.\n";
"""
        
        import base64
        encoded = base64.b64encode(script.encode()).decode()
        
        cmd = f"echo '{encoded}' | base64 -d > /tmp/fix_permits.php && docker cp /tmp/fix_permits.php svms-app-1:/tmp/fix_permits.php && docker exec svms-app-1 php /tmp/fix_permits.php"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    fix_permits("103.175.219.57", "root", "M4ruw4h3@")
