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

out = run_cmd("find /var/www/svms -name 'page.jsx' | grep 'src/app/page.jsx'")
paths = [p.strip() for p in out.split('\n') if p.strip()]

if paths:
    target_path = paths[0]
    print(f"Found target path: {target_path}")
    
    # upload
    sftp = ssh.open_sftp()
    sftp.put(r'd:\MP\apps\web\src\app\page.jsx', target_path)
    sftp.close()
    print("Uploaded modified page.jsx")
    
    # rebuild frontend
    run_cmd("cd /var/www/svms && docker compose up -d --build frontend")
else:
    print("Could not find page.jsx on the remote server.")

ssh.close()
