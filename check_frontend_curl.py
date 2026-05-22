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

run_cmd("docker exec svms-frontend-1 curl -s http://localhost:4000/ | grep -i 'NewsHybrid'")
# Let's also check the actual built output in the container
run_cmd("docker exec svms-frontend-1 grep -r -i 'NewsHybrid' /app/build/ || echo 'Not in build'")

ssh.close()
