import paramiko
import os

def deploy():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    files_to_deploy = [
        ("VendorController.php", "/var/www/svms/backend/app/Http/Controllers/VendorController.php"),
        ("GridController.php", "/var/www/svms/backend/app/Http/Controllers/GridController.php"),
        ("app/Http/Controllers/PermitController.php", "/var/www/svms/backend/app/Http/Controllers/PermitController.php"),
        ("admin_index.html", "/var/www/svms/backend/resources/views/admin.blade.php"),
        ("MarketDataUpdated.php", "/var/www/svms/backend/app/Events/MarketDataUpdated.php")
    ]
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=user, password=password)
    sftp = client.open_sftp()
    
    for local_path, remote_path in files_to_deploy:
        print(f"Deploying {local_path} to {remote_path}...")
        # Ensure remote directory exists
        remote_dir = os.path.dirname(remote_path)
        client.exec_command(f"mkdir -p {remote_dir}")
        sftp.put(local_path, remote_path)
        
        # Copy to docker container
        container_path = remote_path.replace("/var/www/svms/backend/", "/var/www/")
        cmd = f"docker cp {remote_path} svms-app-1:{container_path}"
        print(f"Running: {cmd}")
        client.exec_command(cmd)
        
    client.close()
    print("Deployment finished.")

if __name__ == "__main__":
    deploy()
