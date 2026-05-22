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
        print("STDOUT:", out[:2000])
    if err:
        print("STDERR:", err[:2000])
    return out

# Check if the public IP responds differently than localhost
run_cmd("curl -s http://103.175.219.57:8001 | head -n 20")

# Check svms-frontend container logs
run_cmd("docker logs --tail 20 svms-frontend-1")

ssh.close()
