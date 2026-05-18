import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def check_deploy_scripts():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    files = [
        "/var/www/steman-alumni/docker-compose.yml",
        "/var/www/steman-alumni/system_optimize.sh"
    ]
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        for file in files:
            print(f"=== File: {file} ===")
            stdin, stdout, stderr = client.exec_command(f"cat {file}")
            print(stdout.read().decode('utf-8', errors='replace'))
            print("="*40 + "\n")
            
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_deploy_scripts()
