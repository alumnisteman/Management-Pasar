import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '103.175.219.57'
USER = 'root'
PASS = 'M4ruw4h3@'

def run_cmd(client, cmd, timeout=300):
    print(f'\n>>> {cmd}')
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    exit_code = stdout.channel.recv_exit_status()
    if out.strip():
        print(out.strip())
    if err.strip():
        print('[STDERR]', err.strip()[:500])
    print(f'[exit: {exit_code}]')
    return exit_code

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASS, timeout=30)

# Step 1: Install Node 20 via NodeSource
print('=== Installing Node.js 20 ===')
run_cmd(client, 'curl -fsSL https://deb.nodesource.com/setup_20.x | bash -', timeout=120)
run_cmd(client, 'apt-get install -y nodejs', timeout=180)
run_cmd(client, 'node --version && npm --version')

# Step 2: Install dependencies
print('\n=== Installing npm dependencies ===')
run_cmd(client, 'cd /var/www/svms/apps/web && npm install --prefer-offline 2>&1 | tail -10', timeout=300)

# Step 3: Build
print('\n=== Building ===')
exit_code = run_cmd(client, 'cd /var/www/svms/apps/web && npm run build 2>&1 | tail -30', timeout=300)

if exit_code == 0:
    print('\n=== BUILD SUCCESS! ===')
else:
    print('\n=== BUILD FAILED ===')

client.close()
