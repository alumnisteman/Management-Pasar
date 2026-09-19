import paramiko
import os

def sync_files():
    host = "192.168.1.18"
    user = "root"
    password = "1"

    files_to_sync = [
        ("routes/api.php", "/var/www/Management-Pasar/routes/api.php"),
        ("resources/views/admin.blade.php", "/var/www/Management-Pasar/resources/views/admin.blade.php"),
        ("apps/web/public/index.html", "/var/www/Management-Pasar/apps/web/public/index.html"),
    ]

    controller_dir = "app/Http/Controllers"
    if os.path.exists(controller_dir):
        for fname in os.listdir(controller_dir):
            if fname.endswith(".php"):
                local_p = os.path.join(controller_dir, fname)
                remote_p = f"/var/www/Management-Pasar/app/Http/Controllers/{fname}"
                files_to_sync.append((local_p, remote_p))

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, username=user, password=password)
    sftp = ssh.open_sftp()

    def sftp_mkdir_p(remote_path):
        dirs = []
        path = remote_path
        while path and path != '/':
            dirs.append(path)
            path = os.path.dirname(path)
        for d in reversed(dirs):
            try:
                sftp.mkdir(d)
            except IOError:
                pass

    for local, remote in files_to_sync:
        if os.path.exists(local):
            print(f"Uploading {local} -> {remote}")
            sftp_mkdir_p(os.path.dirname(remote))
            sftp.put(local, remote)

    sftp.close()

    print("Copying files into backend container & clearing routes cache...")
    commands = [
        "mkdir -p /var/www/Management-Pasar/app/Http/Controllers /var/www/Management-Pasar/routes /var/www/Management-Pasar/resources/views /var/www/Management-Pasar/apps/web/public",
        "docker exec management-pasar-backend-1 mkdir -p /var/www/app/Http/Controllers /var/www/routes /var/www/resources/views /var/www/apps/web/public",
        "docker cp /var/www/Management-Pasar/app/Http/Controllers/. management-pasar-backend-1:/var/www/app/Http/Controllers/",
        "docker cp /var/www/Management-Pasar/routes/. management-pasar-backend-1:/var/www/routes/",
        "docker cp /var/www/Management-Pasar/resources/views/. management-pasar-backend-1:/var/www/resources/views/",
        "docker exec management-pasar-backend-1 php artisan route:clear",
        "docker exec management-pasar-backend-1 php artisan config:clear",
    ]

    combined_cmd = " && ".join(commands)
    stdin, stdout, stderr = ssh.exec_command(combined_cmd)
    print(stdout.read().decode())
    ssh.close()
    print("Deployment finished successfully!")

if __name__ == "__main__":
    sync_files()
