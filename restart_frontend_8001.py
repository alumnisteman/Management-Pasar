import paramiko
import time, sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

port = 8001
print(f"Force killing any process on port {port}...")
ssh.exec_command(f'fuser -k {port}/tcp 2>/dev/null || true')
time.sleep(2)
ssh.exec_command('killall -9 node 2>/dev/null || true')
time.sleep(2)

# Verify free
stdin, stdout, _ = ssh.exec_command(f'ss -tlnp | grep {port}')
out = stdout.read().decode('utf-8', errors='replace').strip()
print(f"Port {port} status before start: [{out}]")

print(f"Starting Next.js on port {port}...")
ssh.exec_command(f'cd /root/news-hybrid/frontend && nohup npm run dev -- -p {port} > /root/news-hybrid/frontend/next.log 2>&1 &')

print("Waiting 20 seconds for compilation...")
time.sleep(20)

# Check logs
stdin, stdout, _ = ssh.exec_command('tail -15 /root/news-hybrid/frontend/next.log')
log = stdout.read().decode('utf-8', errors='replace')
sys.stdout.buffer.write(log.encode('utf-8'))
sys.stdout.buffer.flush()

# Verify port listening
stdin, stdout, _ = ssh.exec_command(f'ss -tlnp | grep {port}')
listen = stdout.read().decode('utf-8', errors='replace').strip()
print(f"\nPort {port} listening info:\n{listen}")

ssh.close()
print(f"Done! Access new landing page at http://103.175.219.57:{port}/")
