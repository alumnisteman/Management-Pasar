import paramiko
import sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

def run_cmd(cmd):
    print(f"=== Running: {cmd} ===")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out:
        print("STDOUT:")
        print(out)
    if err:
        print("STDERR:")
        print(err)

run_cmd("docker ps -a")
run_cmd("docker compose -f /root/news-hybrid/docker-compose.yml ps")
run_cmd("cat /root/news-hybrid/docker-compose.yml")
run_cmd("docker logs --tail 50 news-hybrid-app-1")
run_cmd("docker logs --tail 50 news-hybrid-mysql-1")

ssh.close()
