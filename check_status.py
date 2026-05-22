import paramiko
import sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

def run_cmd(cmd):
    print(f"Running: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out:
        print("STDOUT:")
        print(out)
    if err:
        print("STDERR:")
        print(err)

print("--- Listening Ports ---")
run_cmd("ss -tlnp | grep -E '3000|3001|8001|8085'")

print("--- Next.js Processes ---")
run_cmd("ps aux | grep -E 'node|next' | grep -v grep")

print("--- Next.js Log ---")
run_cmd("tail -n 25 /root/news-hybrid/frontend/next.log")

print("--- Curl to Port 8001 ---")
run_cmd("curl -I http://localhost:8001")

print("--- Curl to Port 8085 (Backend API) ---")
run_cmd("curl -I http://localhost:8085/api/news")

ssh.close()
