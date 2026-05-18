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
        print("=== Running git fetch on Server ===")
        stdin, stdout, stderr = client.exec_command("cd /var/www/svms/backend && git fetch origin master")
        print("STDOUT:")
        print(stdout.read().decode('utf-8', errors='ignore'))
        print("STDERR:")
        print(stderr.read().decode('utf-8', errors='ignore'))
        
        print("=== Running git status ===")
        stdin, stdout, stderr = client.exec_command("cd /var/www/svms/backend && git status -u")
        print(stdout.read().decode('utf-8'))
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check()
