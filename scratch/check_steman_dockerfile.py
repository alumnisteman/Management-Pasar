import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def check_dockerfile():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        print("=== /var/www/steman-alumni/Dockerfile ===")
        stdin, stdout, stderr = client.exec_command("cat /var/www/steman-alumni/Dockerfile")
        print(stdout.read().decode('utf-8', errors='replace'))
        print("="*40 + "\n")
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_dockerfile()
