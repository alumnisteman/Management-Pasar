import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

def run(cmd, label=None):
    if label:
        print(f'\n=== {label} ===')
    print(f'>> {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out.strip(): print(out)
    if err.strip(): print('ERR:', err)
    return out

# Check inside the svms-app-1 container
run('docker exec svms-app-1 cat /var/www/html/.env 2>/dev/null | grep -E "DB_|REDIS|CACHE" || docker exec svms-app-1 env | grep -E "DB_|REDIS|CACHE"', "svms-app-1 ENV config")

run('docker exec svms-app-1 php artisan --version 2>&1', "PHP artisan in container")

# Get the real error from inside the container
run(
    'docker exec svms-app-1 php artisan tinker --execute "echo json_encode(App\\\\Http\\\\Controllers\\\\TenantPortalController::class);" 2>&1',
    "Test controller exists"
)

# Check actual error log inside container
run('docker exec svms-app-1 tail -n 60 storage/logs/laravel.log 2>&1 | grep -E "ERROR|Exception" | tail -20', "Container error log")

# More detailed - check the full error from container logs
run('docker logs svms-app-1 --tail=30 2>&1', "Container Docker logs")

# Try running pay-bill from INSIDE the container
run(
    'docker exec svms-app-1 curl -s -X POST http://localhost:8000/api/tenant/pay-bill -H "Content-Type: application/json" -d \'{"bill_id":1,"trader_id":1}\' 2>&1',
    "Test pay-bill from inside container"
)

# Check DB connectivity
run('docker exec svms-app-1 php artisan tinker --execute "echo DB::connection()->getPdo() ? \'DB OK\' : \'DB FAIL\';" 2>&1', "DB connectivity test")

# Get bills table data
run('docker exec svms-app-1 php artisan tinker --execute "echo json_encode(DB::table(\'bills\')->limit(3)->get());" 2>&1', "Bills table data")

# Check Wallet table
run('docker exec svms-app-1 php artisan tinker --execute "echo json_encode(DB::table(\'wallets\')->limit(3)->get());" 2>&1', "Wallets table data")

ssh.close()
print('\n=== DONE ===')
