import paramiko
import base64
import sys

def deploy_elite(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        
        # 1. Upload Migration
        print("Uploading migration...")
        with open("2026_05_07_300000_smart_market_full_schema.php", 'rb') as f:
            encoded_mig = base64.b64encode(f.read()).decode('utf-8')
        client.exec_command(f"echo '{encoded_mig}' | base64 -d > /var/www/svms/backend/database/migrations/2026_05_07_300000_smart_market_full_schema.php")
        
        # 2. Upload Seeder
        print("Uploading seeder...")
        with open("SmartMarketSeeder.php", 'rb') as f:
            encoded_seed = base64.b64encode(f.read()).decode('utf-8')
        client.exec_command(f"echo '{encoded_seed}' | base64 -d > /var/www/svms/backend/database/seeders/SmartMarketSeeder.php")
        
        # 3. Run Migrate Fresh and Seed
        print("Executing migrate:fresh and seeding...")
        # Target svms-app-1
        cmd = "docker exec -w /var/www svms-app-1 php artisan migrate:fresh --force"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(f"Migrate STDOUT: {stdout.read().decode()}")
        print(f"Migrate STDERR: {stderr.read().decode()}")
        
        cmd_seed = "docker exec -w /var/www svms-app-1 php artisan db:seed --class=SmartMarketSeeder --force"
        stdin, stdout, stderr = client.exec_command(cmd_seed)
        print(f"Seed STDOUT: {stdout.read().decode()}")
        print(f"Seed STDERR: {stderr.read().decode()}")
        
    except Exception as e:
        print(f"Exception: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    deploy_elite("103.175.219.57", "root", "M4ruw4h3@")
