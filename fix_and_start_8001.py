import paramiko
import sys
import time

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

print("Step 1: Killing all node/next/port 3001/port 8001 processes...")
run_cmd("fuser -k 3001/tcp 2>/dev/null || true")
run_cmd("fuser -k 8001/tcp 2>/dev/null || true")
run_cmd("pkill -9 -f next-server || true")
run_cmd("pkill -9 -f next || true")
run_cmd("pkill -9 -f node || true")
time.sleep(3)

print("Step 2: Checking listening ports...")
run_cmd("ss -tlnp | grep -E '3001|8001'")

print("Step 3: Checking page.tsx content...")
run_cmd("cat /root/news-hybrid/frontend/src/app/page.tsx | head -n 30")

print("Step 4: Starting Next.js on port 8001...")
run_cmd("cd /root/news-hybrid/frontend && nohup npx next dev -p 8001 > /root/news-hybrid/frontend/next.log 2>&1 &")

print("Step 5: Waiting 25 seconds for Next.js compilation...")
time.sleep(25)

print("Step 6: Checking next.log...")
run_cmd("cat /root/news-hybrid/frontend/next.log | tail -n 40")

print("Step 7: Verifying port 8001 and response...")
run_cmd("ss -tlnp | grep 8001")
run_cmd("curl -I http://localhost:8001")
run_cmd("curl -s http://localhost:8001 | head -n 30")

ssh.close()
print("Execution completed.")
