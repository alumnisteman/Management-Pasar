import paramiko
import base64
import os

def deploy():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    files = [
        ("database/migrations/2026_05_11_100000_create_porter_system_tables.php", "/var/www/svms/backend/database/migrations/2026_05_11_100000_create_porter_system_tables.php"),
        ("Porter.php", "/var/www/svms/backend/app/Models/Porter.php"),
        ("PorterJob.php", "/var/www/svms/backend/app/Models/PorterJob.php"),
        ("PorterIncentive.php", "/var/www/svms/backend/app/Models/PorterIncentive.php"),
        ("PorterController.php", "/var/www/svms/backend/app/Http/Controllers/PorterController.php"),
        ("api.php", "/var/www/svms/backend/routes/api.php"),
        ("PorterSeeder.php", "/var/www/svms/backend/database/seeders/PorterSeeder.php"),
        ("landing.html", "/var/www/svms/backend/resources/views/landing.blade.php"),
        ("porter.html", "/var/www/svms/backend/resources/views/porter.blade.php"),
        ("routes/web.php", "/var/www/svms/backend/routes/web.php"),
    ]
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=user, password=password)
    
    for local, remote in files:
        if not os.path.exists(local):
            print(f"Skipping {local} (not found)")
            continue
        print(f"Deploying {local}...")
        remote_dir = os.path.dirname(remote)
        client.exec_command(f"mkdir -p {remote_dir}")
        with open(local, 'rb') as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
        client.exec_command(f"echo '{encoded}' | base64 -d > {remote}")
        
        # Also copy into docker
        container_path = remote.replace("/var/www/svms/backend/", "/var/www/")
        client.exec_command(f"docker exec svms-app-1 mkdir -p {os.path.dirname(container_path)}")
        client.exec_command(f"docker cp {remote} svms-app-1:{container_path}")
        
    print("Running migration and seeding...")
    client.exec_command("docker exec svms-app-1 php artisan migrate --path=database/migrations/2026_05_11_100000_create_porter_system_tables.php")
    client.exec_command("docker exec svms-app-1 php artisan db:seed --class=PorterSeeder")
    
    client.close()
    print("Porter Module Deployment finished.")

if __name__ == "__main__":
    deploy()
