import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def check_steman_alumni():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        print("=== Checking /var/www/steman-alumni git remote ===")
        stdin, stdout, stderr = client.exec_command("cd /var/www/steman-alumni && git remote -v")
        print(stdout.read().decode('utf-8', errors='replace'))
        
        print("=== Checking /var/www/steman-alumni git status -sb ===")
        stdin, stdout, stderr = client.exec_command("cd /var/www/steman-alumni && git status -sb")
        print(stdout.read().decode('utf-8', errors='replace'))
        
        print("=== Checking differences from remote ===")
        stdin, stdout, stderr = client.exec_command("cd /var/www/steman-alumni && git fetch origin && git log HEAD..origin/master --oneline")
        print(stdout.read().decode('utf-8', errors='replace'))
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_steman_alumni()
