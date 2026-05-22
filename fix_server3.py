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

# Step 1: Find the Docker container on port 8001
run('docker ps --format "table {{.ID}}\\t{{.Names}}\\t{{.Ports}}\\t{{.Status}}" | grep -E "8001|CONTAINER"', "Docker containers on port 8001")

# Step 2: Find ALL docker containers
run('docker ps --format "table {{.ID}}\\t{{.Names}}\\t{{.Ports}}" | head -30', "All Docker containers")

# Step 3: Test the actual endpoint at port 8001
run(
    'curl -s -X POST http://127.0.0.1:8001/api/tenant/pay-bill -H "Content-Type: application/json" -d \'{"bill_id":1,"trader_id":1}\' 2>&1',
    "Test pay-bill at port 8001"
)

# Step 4: Test dashboard endpoint first to see if API works at all
run(
    'curl -s http://127.0.0.1:8001/api/tenant/dashboard/1 2>&1 | head -100',
    "Test dashboard at port 8001"
)

# Step 5: Check .env for Redis/DB config
run('cat /var/www/svms/backend/.env | grep -E "REDIS|DB_|CACHE"', "Current .env Redis/DB/Cache settings")

ssh.close()
print('\n=== DONE ===')
