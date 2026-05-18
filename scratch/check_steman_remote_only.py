import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def check_remote_only():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        # Check steman-alumni remote
        print("=== /var/www/steman-alumni remote ===")
        stdin, stdout, stderr = client.exec_command("cd /var/www/steman-alumni && git remote -v")
        print(stdout.read().decode('utf-8'))
        
        # Check steman-alumni branch status (first line of status -sb)
        print("=== /var/www/steman-alumni branch status ===")
        stdin, stdout, stderr = client.exec_command("cd /var/www/steman-alumni && git status -sb | head -n 2")
        print(stdout.read().decode('utf-8'))
        
        # Check differences from origin/main
        print("=== /var/www/steman-alumni differences from origin/main ===")
        stdin, stdout, stderr = client.exec_command("cd /var/www/steman-alumni && git log HEAD..origin/main --oneline")
        print(stdout.read().decode('utf-8'))
        
        # Check differences from origin/master
        print("=== /var/www/steman-alumni differences from origin/master ===")
        stdin, stdout, stderr = client.exec_command("cd /var/www/steman-alumni && git log HEAD..origin/master --oneline")
        print(stdout.read().decode('utf-8'))
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_remote_only()
