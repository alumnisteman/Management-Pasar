import paramiko
import os
import base64

def deploy():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    files_to_deploy = [
        ("admin_modern.html", "/var/www/svms/backend/resources/views/admin.blade.php"),
    ]
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=user, password=password)
    sftp = client.open_sftp()
    
    for local_path, remote_path in files_to_deploy:
        print(f"Deploying {local_path} to {remote_path}...")
        remote_dir = os.path.dirname(remote_path)
        client.exec_command(f"mkdir -p {remote_dir}")
        sftp.put(local_path, remote_path)
        
        container_path = remote_path.replace("/var/www/svms/backend/", "/var/www/")
        cmd = f"docker cp {remote_path} svms-app-1:{container_path}"
        print(f"Running: {cmd}")
        client.exec_command(cmd)
        
    client.exec_command("docker exec svms-app-1 php artisan view:clear")
    client.close()
    print("Deployment finished.")

if __name__ == "__main__":
    deploy()
