import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def check_entrypoint():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        print("=== /var/www/steman-alumni/docker/docker-entrypoint.sh ===")
        stdin, stdout, stderr = client.exec_command("cat /var/www/steman-alumni/docker/docker-entrypoint.sh")
        print(stdout.read().decode('utf-8', errors='replace'))
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_entrypoint()
