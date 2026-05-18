import paramiko
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def deploy_to_server():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    # Files to transfer: (local_path, remote_path)
    # The remote base dir is /var/www/svms/backend/
    base_remote = "/var/www/svms/backend"
    
    files_to_transfer = [
        # Backend Eloquent Models & Migration
        ("database/migrations/2026_05_18_100000_create_iot_and_traffic_tables.php", "database/migrations/2026_05_18_100000_create_iot_and_traffic_tables.php"),
        ("app/Models/SmartMeterReading.php", "app/Models/SmartMeterReading.php"),
        ("app/Models/FootTrafficLog.php", "app/Models/FootTrafficLog.php"),
        ("app/Models/Slot.php", "app/Models/Slot.php"),
        ("database/seeders/DummyDataSeeder.php", "database/seeders/DummyDataSeeder.php"),
        
        # Backend Controllers & Routes
        ("app/Http/Controllers/IotMeterController.php", "app/Http/Controllers/IotMeterController.php"),
        ("app/Http/Controllers/TenantPortalController.php", "app/Http/Controllers/TenantPortalController.php"),
        ("app/Http/Controllers/AiAnalyticsController.php", "app/Http/Controllers/AiAnalyticsController.php"),
        ("app/Http/Controllers/GridController.php", "app/Http/Controllers/GridController.php"),
        ("routes/api.php", "routes/api.php"),
        
        # Frontend Files
        ("apps/web/package.json", "apps/web/package.json"),
        ("apps/web/.npmrc", "apps/web/.npmrc"),
        ("apps/web/src/app/admin/stall-map/page.jsx", "apps/web/src/app/admin/stall-map/page.jsx"),
        ("apps/web/src/app/admin/iot-billing/page.jsx", "apps/web/src/app/admin/iot-billing/page.jsx"),
        ("apps/web/src/app/tenant/page.jsx", "apps/web/src/app/tenant/page.jsx"),
        ("apps/web/src/app/admin/analytics/page.jsx", "apps/web/src/app/admin/analytics/page.jsx"),
        ("apps/web/src/app/admin/layout.jsx", "apps/web/src/app/admin/layout.jsx")
    ]
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        print(f"Connecting to {host} via SSH...")
        client.connect(host, username=user, password=password)
        print("SSH Connection established!")
        
        # Open SFTP client
        sftp = client.open_sftp()
        print("SFTP Channel opened! Starting file transfer...")
        
        for local_rel, remote_rel in files_to_transfer:
            local_abs = os.path.join("d:\\MP", local_rel.replace("/", "\\"))
            remote_abs = f"{base_remote}/{remote_rel}"
            
            # Ensure remote directory exists
            remote_dir = os.path.dirname(remote_abs)
            try:
                sftp.stat(remote_dir)
            except IOError:
                print(f"Creating remote folder: {remote_dir}")
                # Recursively create remote directory if needed
                parts = remote_dir.split('/')
                current = ""
                for part in parts:
                    if part == "":
                        continue
                    current += "/" + part
                    try:
                        sftp.stat(current)
                    except IOError:
                        sftp.mkdir(current)
            
            print(f"Uploading: {local_rel} -> {remote_abs}")
            sftp.put(local_abs, remote_abs)
            
        sftp.close()
        print("All SVMS v6.0 files successfully uploaded to the production server!")
        
        # Run DB migration and seeders inside Docker
        print("\n=== Executing Laravel Migration & Seeder on Production ===")
        stdin, stdout, stderr = client.exec_command("docker exec svms-app-1 php artisan migrate --seed")
        print("STDOUT:")
        print(stdout.read().decode('utf-8', errors='ignore'))
        print("STDERR:")
        print(stderr.read().decode('utf-8', errors='ignore'))
        
        # Re-build frontend dashboard on production
        print("\n=== Building and Re-bundling SVMS Frontend React Dashboard ===")
        # We need to compile node modules and build inside svms-frontend-1 or re-build the container
        # Let's check how the frontend container is configured to run or if we can run bun/npm compile
        stdin, stdout, stderr = client.exec_command("docker exec svms-frontend-1 npm install --legacy-peer-deps")
        print("NPM INSTALL STDOUT:")
        print(stdout.read().decode('utf-8', errors='ignore'))
        print("NPM INSTALL STDERR:")
        print(stderr.read().decode('utf-8', errors='ignore'))
        
        stdin, stdout, stderr = client.exec_command("docker exec svms-frontend-1 npm run build")
        print("NPM BUILD STDOUT:")
        print(stdout.read().decode('utf-8', errors='ignore'))
        print("NPM BUILD STDERR:")
        print(stderr.read().decode('utf-8', errors='ignore'))
        
        # Restart the container to pick up changes if necessary
        print("\n=== Restarting svms-frontend-1 to hot-reload React Router dev routes ===")
        client.exec_command("docker restart svms-frontend-1")
        print("Restart command dispatched!")
        
        client.close()
        print("\nDeployment completed successfully!")
    except Exception as e:
        print(f"Deployment Error: {e}")

if __name__ == "__main__":
    deploy_to_server()
