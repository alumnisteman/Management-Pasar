import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def rebuild():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        print("=== Step 1: Force syncing Git repo on the server ===")
        stdin, stdout, stderr = client.exec_command("cd /var/www/svms/backend && git fetch origin master && git reset --hard origin/master")
        print(stdout.read().decode('utf-8'))
        print(stderr.read().decode('utf-8'))
        
        print("=== Step 2: Rebuilding React frontend Docker image ===")
        stdin, stdout, stderr = client.exec_command("docker build -t svms-dashboard:latest /var/www/svms/backend/apps/web")
        print(stdout.read().decode('utf-8'))
        print(stderr.read().decode('utf-8'))
        
        print("=== Step 3: Recreating frontend container via root compose ===")
        stdin, stdout, stderr = client.exec_command("cd /var/www/svms && docker compose up -d --force-recreate frontend")
        print(stdout.read().decode('utf-8'))
        print(stderr.read().decode('utf-8'))
        
        print("=== Step 4: Checking container logs ===")
        stdin, stdout, stderr = client.exec_command("docker logs --tail 20 svms-frontend-1")
        print(stdout.read().decode('utf-8'))
        print(stderr.read().decode('utf-8'))
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    rebuild()
