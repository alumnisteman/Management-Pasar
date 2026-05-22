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
        print("STDOUT:", out[:3000])
    if err:
        print("STDERR:", err[:3000])
    return out

run_cmd("docker exec svms-frontend-1 cat /app/src/app/page.jsx | grep -A 2 -B 2 'NewsHybrid'")
run_cmd("docker exec svms-frontend-1 ls -la /app/build/client/assets | head -n 10")
# check if the built js files contain NewsHybrid
run_cmd("docker exec svms-frontend-1 grep -r 'NewsHybrid' /app/build/ || echo 'Not in build'")

ssh.close()
