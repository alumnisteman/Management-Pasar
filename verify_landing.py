import paramiko
import sys

# Force UTF-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

def run_cmd(cmd):
    print(f"=== {cmd} ===")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out: print("STDOUT:", out[:3000])
    if err: print("STDERR:", err[:1000])

# Check Next.js process
run_cmd("pgrep -la next")

# Check Next.js log (strip unicode box-drawing chars)
run_cmd("tail -80 /root/news-hybrid/frontend/next.log | cat")

# Test landing page HTML
run_cmd("curl -s http://localhost:8001/ | grep -o '<h1[^>]*>.*</h1>' | head -5")

# Test proxy endpoint
run_cmd("curl -s http://localhost:8001/api/news?page=1 | python3 -c \"import json,sys; d=json.load(sys.stdin); print('Total news:', d.get('total',0), '| First title:', d['data'][0]['title'] if d.get('data') else 'NONE')\"")

ssh.close()
