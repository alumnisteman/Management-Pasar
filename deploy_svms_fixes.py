import paramiko
import os
import sys

hostname = "103.175.219.57"
username = "root"
password = "M4ruw4h3@"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(hostname, username=username, password=password)

sftp = ssh.open_sftp()

# Ensure remote directories exist
def ensure_remote_dir(remote_path):
    parts = remote_path.split('/')
    current = ""
    for part in parts:
        if not part:
            continue
        current += "/" + part
        try:
            sftp.stat(current)
        except IOError:
            print(f"Creating remote directory: {current}")
            sftp.mkdir(current)

files_to_upload = [
    (r"D:\MP\app\Http\Controllers\TenantPortalController.php", "/var/www/svms/backend/app/Http/Controllers/TenantPortalController.php"),
    (r"D:\MP\apps\web\src\app\admin\stall-map\page.jsx", "/var/www/svms/backend/apps/web/src/app/admin/stall-map/page.jsx"),
    (r"D:\MP\apps\web\src\app\api\admin\stall-map\route.js", "/var/www/svms/backend/apps/web/src/app/api/admin/stall-map/route.js"),
    (r"D:\MP\apps\web\src\app\api\tenant\pay-bill\route.js", "/var/www/svms/backend/apps/web/src/app/api/tenant/pay-bill/route.js"),
    (r"D:\MP\apps\web\src\app\page.jsx", "/var/www/svms/backend/apps/web/src/app/page.jsx"),
    (r"D:\MP\apps\web\src\app\tenant\page.jsx", "/var/www/svms/backend/apps/web/src/app/tenant/page.jsx"),
    (r"D:\MP\apps\web\src\app\api\tenant\traders\route.js", "/var/www/svms/backend/apps/web/src/app/api/tenant/traders/route.js")
]

for local_path, remote_path in files_to_upload:
    remote_dir = "/".join(remote_path.split("/")[:-1])
    ensure_remote_dir(remote_dir)
    print(f"Uploading {local_path} to {remote_path}...")
    sftp.put(local_path, remote_path)

sftp.close()

def run_cmd(cmd):
    print(f"\n=== Executing: {cmd} ===")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out:
        print("STDOUT:")
        print(out[:4000])
    if err:
        print("STDERR:")
        print(err[:2000])
    return out

# Restart backend app to reload Octane cache/code
run_cmd("cd /var/www/svms && docker compose restart app")

# Build and recreate frontend container
run_cmd("cd /var/www/svms && docker compose build --no-cache frontend")
run_cmd("cd /var/www/svms && docker compose up -d frontend")

# Check status of docker compose
run_cmd("cd /var/www/svms && docker compose ps")

ssh.close()
print("\nDone!")
