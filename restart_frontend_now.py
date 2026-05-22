import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

def run_cmd(cmd):
    print(f"\n=== Running: {cmd} ===")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out:
        print("STDOUT:", out)
    if err:
        print("STDERR:", err)
    return out

print("Starting recreated container...")
run_cmd("cd /var/www/svms && docker compose up -d frontend")

print("\nVerifying container status...")
run_cmd("docker ps | grep svms-frontend")

print("\nVerifying page content in src...")
run_cmd("docker exec svms-frontend-1 cat /app/src/app/page.jsx | grep -A 2 -B 2 'NewsHybrid'")

print("\nVerifying built client assets...")
run_cmd("docker exec svms-frontend-1 ls -la /app/build/client/assets | head -n 15")

print("\nChecking if NewsHybrid is in build...")
run_cmd("docker exec svms-frontend-1 grep -r 'NewsHybrid' /app/build/ || echo 'Not in build'")

ssh.close()
