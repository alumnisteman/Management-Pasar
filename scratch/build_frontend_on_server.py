import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def check():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        print("=== Step 1: Rebuilding svms-dashboard:latest image ===")
        # We run the docker build command on the server
        stdin, stdout, stderr = client.exec_command("docker build -t svms-dashboard:latest /var/www/svms/backend/apps/web")
        
        # Read output line by line so we can track the progress in real-time
        for line in iter(stdout.readline, ""):
            print(line, end="")
        for line in iter(stderr.readline, ""):
            print(line, end="")
            
        print("=== Step 2: Restarting frontend container ===")
        stdin, stdout, stderr = client.exec_command("cd /var/www/svms && docker compose up -d --force-recreate frontend")
        print(stdout.read().decode('utf-8'))
        print(stderr.read().decode('utf-8'))
        
        print("=== Step 3: Checking docker ps ===")
        stdin, stdout, stderr = client.exec_command("docker ps")
        print(stdout.read().decode('utf-8'))
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check()
