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
        print(out.strip()[-3000:])  # last 3000 chars
    if err.strip():
        print('[STDERR]', err.strip()[-500:])
    print(f'[exit: {exit_code}]')
    return exit_code

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASS, timeout=30)

# Install deps with legacy-peer-deps
print('=== npm install --legacy-peer-deps ===')
run_cmd(client, 'cd /var/www/svms/apps/web && npm install --legacy-peer-deps 2>&1 | tail -15', timeout=300)

# Verify hono is installed
print('\n=== Verifying key deps ===')
run_cmd(client, 'ls /var/www/svms/apps/web/node_modules/hono 2>/dev/null && echo "hono OK" || echo "hono MISSING"')
run_cmd(client, 'ls /var/www/svms/apps/web/node_modules/react-router-hono-server 2>/dev/null && echo "hono-server OK" || echo "hono-server MISSING"')

# Build
print('\n=== npm run build ===')
exit_code = run_cmd(client, 'cd /var/www/svms/apps/web && npm run build 2>&1', timeout=300)

if exit_code == 0:
    print('\n=== BUILD SUCCESS! ===')
    # List build output
    run_cmd(client, 'ls -la /var/www/svms/apps/web/build/')
else:
    print('\n=== BUILD FAILED ===')

client.close()
