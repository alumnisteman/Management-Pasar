import paramiko
import sys
import time

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
        print("STDOUT:")
        print(out[:3000])
    if err:
        print("STDERR:")
        print(err[:1000])
    return out

print("Restarting SVMS Docker Compose...")
run_cmd("cd /var/www/svms && docker compose down && docker compose up -d")

print("\nWaiting 10 seconds for containers to initialize...")
time.sleep(10)

print("\nChecking listening ports...")
run_cmd("ss -tlnp | grep -E '8001|8002'")

print("\nTesting Curl to http://localhost:8001...")
run_cmd("curl -sI http://localhost:8001")
run_cmd("curl -s http://localhost:8001 | grep -i -E 'NewsHybrid|SVMS' | head -n 10")

print("\nTesting Curl to http://localhost:8002...")
run_cmd("curl -sI http://localhost:8002")

ssh.close()
