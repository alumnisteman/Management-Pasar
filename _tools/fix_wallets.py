import paramiko

def fix_wallets():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        # Create wallets for traders who don't have one
        cmd = "docker exec svms-app-1 php artisan tinker --execute=\"App\Models\Trader::doesntHave('wallet')->get()->each(function(\$t) { App\Models\Wallet::create(['id' => (string) \Illuminate\Support\Str::uuid(), 'trader_id' => \$t->id, 'balance' => 0]); });\""
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        print(stderr.read().decode())
    finally:
        client.close()

if __name__ == "__main__":
    fix_wallets()
