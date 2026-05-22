import paramiko
import sys
import io

sys.stdout.reconfigure(encoding='utf-8')

# Read local file
with open(r'd:\MP\apps\web\src\app\page.jsx', 'r', encoding='utf-8') as f:
    local_content = f.read()

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

sftp = ssh.open_sftp()
target = '/var/www/svms/backend/apps/web/src/app/page.jsx'
print(f"Uploading {len(local_content)} bytes to {target}...")
sftp.putfo(io.BytesIO(local_content.encode('utf-8')), target)
sftp.close()

print("Verifying upload...")
run_cmd(f"cat {target} | grep 'NewsHybrid'")

print("Rebuilding frontend...")
run_cmd("cd /var/www/svms && docker compose up -d --build frontend")

ssh.close()
