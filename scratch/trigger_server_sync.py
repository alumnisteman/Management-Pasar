import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def sync_and_deploy():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        print(f"Connecting to production server {host}...")
        client.connect(host, username=user, password=password)
        print("SSH Connection Successful!")
        
        # 1. Trigger Git Sync
        print("\n=== Running git_sync.sh on Server ===")
        stdin, stdout, stderr = client.exec_command("/var/www/svms/git_sync.sh")
        print("STDOUT:")
        print(stdout.read().decode('utf-8', errors='ignore'))
        print("STDERR:")
        print(stderr.read().decode('utf-8', errors='ignore'))
        
        # 2. Run Laravel Migration for IoT & Traffic tables
        print("\n=== Running php artisan migrate ===")
        stdin, stdout, stderr = client.exec_command("docker exec svms-app-1 php artisan migrate --force")
        print("STDOUT:")
        print(stdout.read().decode('utf-8', errors='ignore'))
        print("STDERR:")
        print(stderr.read().decode('utf-8', errors='ignore'))
        
        # 3. Seed Dummy Data
        print("\n=== Seeding Database (DummyDataSeeder) ===")
        stdin, stdout, stderr = client.exec_command("docker exec svms-app-1 php artisan db:seed --class=DummyDataSeeder --force")
        print("STDOUT:")
        print(stdout.read().decode('utf-8', errors='ignore'))
        print("STDERR:")
        print(stderr.read().decode('utf-8', errors='ignore'))
        
        # 4. Install Frontend NPM Packages (using the new .npmrc legacy-peer-deps config)
        print("\n=== Running npm install on Frontend ===")
        stdin, stdout, stderr = client.exec_command("docker exec svms-frontend-1 npm install --legacy-peer-deps")
        print("STDOUT:")
        print(stdout.read().decode('utf-8', errors='ignore'))
        print("STDERR:")
        print(stderr.read().decode('utf-8', errors='ignore'))
        
        # 5. Build React Dashboard
        print("\n=== Compiling and Building Frontend ===")
        stdin, stdout, stderr = client.exec_command("docker exec svms-frontend-1 npm run build")
        print("STDOUT:")
        print(stdout.read().decode('utf-8', errors='ignore'))
        print("STDERR:")
        print(stderr.read().decode('utf-8', errors='ignore'))
        
        # 6. Restart Frontend Container
        print("\n=== Restarting svms-frontend-1 container ===")
        client.exec_command("docker restart svms-frontend-1")
        print("Restart command dispatched successfully!")
        
        client.close()
        print("\nProduction deployment and synchronization fully completed!")
    except Exception as e:
        print(f"Error during deployment: {e}")

if __name__ == "__main__":
    sync_and_deploy()
