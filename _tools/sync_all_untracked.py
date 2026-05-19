import os
import paramiko

def create_remote_dir(sftp, remote_dir):
    """Recursively create directories on remote server if they don't exist."""
    path_parts = [p for p in remote_dir.split('/') if p]
    current = ""
    if remote_dir.startswith('/'):
        current = "/"
    
    for part in path_parts:
        current = os.path.join(current, part).replace('\\', '/')
        try:
            sftp.stat(current)
        except IOError:
            print(f"Creating remote directory: {current}")
            sftp.mkdir(current)

def main():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    local_base = "d:/MP"
    remote_base = "/var/www/svms"
    
    FILES_TO_SYNC = [
        # Core system configs & routes
        ".gitignore",
        "docker-compose.yml",
        "routes/api.php",

        # Frontend Admin Porter page
        "apps/web/src/app/admin/porter/page.jsx",

        # Models
        "app/Models/Customer.php",
        "app/Models/EmergencyReport.php",
        "app/Models/LoyaltyPoint.php",
        "app/Models/Order.php",
        "app/Models/OrderItem.php",
        "app/Models/Product.php",
        "app/Models/PurchaseOrder.php",
        "app/Models/PurchaseOrderItem.php",
        "app/Models/WasteLog.php",

        # Controllers
        "app/Http/Controllers/EcommerceController.php",
        "app/Http/Controllers/EmergencyController.php",
        "app/Http/Controllers/LoyaltyController.php",
        "app/Http/Controllers/SupplyChainController.php",
        "app/Http/Controllers/WasteController.php",

        # Migrations
        "database/migrations/2026_05_19_000000_add_performance_indexes.php",
        "database/migrations/2026_05_20_100000_create_waste_logs_table.php",
        "database/migrations/2026_05_20_100001_create_ecommerce_tables.php",
        "database/migrations/2026_05_20_100002_create_b2b_supply_tables.php",
        "database/migrations/2026_05_20_100003_create_loyalty_tables.php",
        "database/migrations/2026_05_20_100004_create_emergency_reports_table.php",
    ]
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        print(f"Connecting to {host} via SSH...")
        client.connect(host, username=user, password=password)
        sftp = client.open_sftp()
        
        for relative_path in FILES_TO_SYNC:
            local_path = os.path.join(local_base, relative_path).replace('\\', '/')
            
            # Route configuration files to server root, and code files to backend
            if relative_path in ["docker-compose.yml", "deploy.sh"]:
                remote_path = os.path.join(remote_base, relative_path).replace('\\', '/')
            else:
                remote_path = os.path.join(remote_base, "backend", relative_path).replace('\\', '/')
            
            # Check if local file exists
            if not os.path.exists(local_path):
                print(f"WARNING: Local file does not exist, skipping: {local_path}")
                continue
            
            # Ensure remote directory exists
            remote_dir = os.path.dirname(remote_path)
            create_remote_dir(sftp, remote_dir)
            
            # Upload file
            print(f"Uploading: {relative_path} -> {remote_path}")
            sftp.put(local_path, remote_path)
            
        sftp.close()
        print("All files synchronized successfully!")
        
        # Ensure deploy.sh has executable permissions
        print("Ensuring deploy.sh is executable...")
        client.exec_command("chmod +x /var/www/svms/deploy.sh")
        print("Permissions set successfully.")
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    main()
