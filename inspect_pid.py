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
        print("STDOUT:")
        print(out)
    if err:
        print("STDERR:")
        print(err)
    return out

run_cmd("ps -ef | grep 2625741 | grep -v grep")
run_cmd("ps aux | grep -i next | head -n 20")
run_cmd("docker ps -q | xargs -I {} sh -c 'docker inspect {} | grep -Hn 2625741 || true'")
run_cmd("docker top svms-frontend-1")

ssh.close()
