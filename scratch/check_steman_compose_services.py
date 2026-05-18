import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def check_services():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        # We will parse/print the first 80 lines of steman-alumni/docker-compose.yml
        print("=== /var/www/steman-alumni/docker-compose.yml (First 120 lines) ===")
        stdin, stdout, stderr = client.exec_command("head -n 120 /var/www/steman-alumni/docker-compose.yml")
        print(stdout.read().decode('utf-8', errors='replace'))
        print("="*40 + "\n")
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_services()
