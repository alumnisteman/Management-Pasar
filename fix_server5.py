import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

def run(cmd, label=None):
    if label:
        print(f'\n=== {label} ===')
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out.strip(): print(out)
    if err.strip(): print('ERR:', err)
    return out

# 1. Check actual controller in Docker container
run('docker exec svms-app-1 cat /var/www/app/Http/Controllers/TenantPortalController.php', "Controller in container")

# 2. Get a real unpaid bill and its trader_id for testing
run(
    "docker exec svms-app-1 php artisan tinker --execute \"echo json_encode(DB::table('bills')->where('status','unpaid')->limit(1)->get());\" 2>&1",
    "Get unpaid bill"
)

# 3. Check docker-compose to understand volumes
run('cat /var/www/svms/docker-compose.yml 2>/dev/null | head -80 || find /root /home -name "docker-compose.yml" 2>/dev/null | xargs grep -l "svms" 2>/dev/null | head -3', "Find docker-compose.yml")

ssh.close()
print('\n=== DONE ===')
