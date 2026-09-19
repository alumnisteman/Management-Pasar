import paramiko
import base64
import os

def deploy():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    files = [
        ("app/Console/Commands/ArchiveOldLogs.php", "/var/www/svms/backend/app/Console/Commands/ArchiveOldLogs.php"),
        ("app/Console/Kernel.php", "/var/www/svms/backend/app/Console/Kernel.php"),
    ]
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=user, password=password)
    
    for local, remote in files:
        print(f"Deploying {local}...")
        remote_dir = os.path.dirname(remote)
        client.exec_command(f"mkdir -p {remote_dir}")
        with open(local, 'rb') as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
        client.exec_command(f"echo '{encoded}' | base64 -d > {remote}")
        
        container_path = remote.replace("/var/www/svms/backend/", "/var/www/")
        client.exec_command(f"docker exec svms-app-1 mkdir -p {os.path.dirname(container_path)}")
        client.exec_command(f"docker cp {remote} svms-app-1:{container_path}")
        
    print("Optimization: Clearing cache...")
    client.exec_command("docker exec svms-app-1 php artisan config:clear")
    
    client.close()
    print("Phase 2 Deployment finished.")

if __name__ == "__main__":
    deploy()
