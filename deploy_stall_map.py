import paramiko
import os

hostname = "103.175.219.57"
username = "root"
password = "M4ruw4h3@"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(hostname, username=username, password=password)

sftp = ssh.open_sftp()

files_to_upload = [
    (r"D:\MP\apps\web\src\app\admin\stall-map\page.jsx", "/var/www/svms/backend/apps/web/src/app/admin/stall-map/page.jsx"),
    (r"D:\MP\apps\web\src\app\api\admin\stall-map\route.js", "/var/www/svms/backend/apps/web/src/app/api/admin/stall-map/route.js")
]

for local_path, remote_path in files_to_upload:
    print(f"Uploading {local_path} to {remote_path}...")
    sftp.put(local_path, remote_path)

sftp.close()

print("Rebuilding frontend container...")
stdin, stdout, stderr = ssh.exec_command("cd /var/www/svms && docker compose build --no-cache frontend && docker compose up -d frontend")
out = stdout.read().decode('utf-8', errors='replace')
err = stderr.read().decode('utf-8', errors='replace')

if out: print("OUT:", out)
if err: print("ERR:", err)

ssh.close()
print("Done!")
