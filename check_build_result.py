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
        print(out[:4000])
    if err:
        print("STDERR:")
        print(err[:2000])

print("Checking docker logs for frontend container:")
run_cmd("docker logs --tail 100 news-hybrid-frontend-1")

print("Checking port 8090 curl response on host:")
run_cmd("curl -si http://localhost:8090/ | head -30")

print("Checking port 8090 API proxy curl response on host:")
run_cmd("curl -si http://localhost:8090/api/news?page=1 | head -30")

print("Checking svms_nginx mappings or proxy configurations:")
run_cmd("docker exec -t svms_nginx nginx -T | grep -i -A 10 -B 10 '8001'")

ssh.close()
