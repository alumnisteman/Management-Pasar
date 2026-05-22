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

run_cmd("uptime")
run_cmd("free -m")
run_cmd("ps aux | grep -i 'docker build' | grep -v grep")
run_cmd("ps aux | grep -i 'docker-compose' | grep -v grep")
run_cmd("ps aux | grep -i 'docker' | grep -v grep | head -n 10")
run_cmd("docker ps -a --filter 'status=running' --format 'table {{.Names}}\t{{.Status}}'")

ssh.close()
