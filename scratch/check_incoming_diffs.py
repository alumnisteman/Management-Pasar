import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def check_incoming_diffs():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        # We can view the diff between HEAD and the new master (which is currently what we hard reset to!)
        # Wait, did the reset succeed?
        # Yes! "git reset --hard origin/main" completed successfully before the build failed!
        # So the repository is now on "da99e17" (which has the new commits).
        # Let's search for "request" in the last 5 commits using git show
        print("=== Searching for 'request' in the changes of the last 5 commits ===")
        cmd = "cd /var/www/steman-alumni && git log -p -n 5 | grep -i 'request'"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode('utf-8', errors='replace')[:4000]) # Limit output
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_incoming_diffs()
