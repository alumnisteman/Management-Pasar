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
        ("MarketDataUpdated.php", "/var/www/svms/backend/app/Events/MarketDataUpdated.php"),
        ("2026_05_10_000001_add_performance_indices.php", "/var/www/svms/backend/database/migrations/2026_05_10_000001_add_performance_indices.php"),
        ("health_guard.sh", "/var/www/svms/health_guard.sh")
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
        
        # If it's a controller/event, copy to docker
        if "/backend/" in remote_path:
            container_path = remote_path.split("/backend/")[1]
            cmd = f"docker cp {remote_path} svms-app-1:/var/www/{container_path}"
            print(f"Running: {cmd}")
            client.exec_command(cmd)
        
        # If it's the health guard, make it executable
        if "health_guard.sh" in remote_path:
            client.exec_command(f"chmod +x {remote_path}")
            
    # Run migration
    print("Running migrations...")
    client.exec_command("docker exec svms-app-1 php artisan migrate --force")
    
    # Set up Cron for health guard (every 5 minutes)
    print("Setting up cron job...")
    cron_cmd = "*/5 * * * * /var/www/svms/health_guard.sh"
    client.exec_command(f"(crontab -l 2>/dev/null; echo '{cron_cmd}') | sort -u | crontab -")
    
    client.close()
    print("Deployment and stabilization finished.")

if __name__ == "__main__":
    deploy()
