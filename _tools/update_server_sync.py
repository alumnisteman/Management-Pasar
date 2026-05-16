import paramiko
import sys
import os

def update_git_sync():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    script_content = """#!/bin/bash
cd /var/www/svms/backend

# 1. Check for server changes
if [[ -n $(git status --porcelain) ]]; then
    echo "Server changes detected. Pushing to GitHub..."
    git add .
    git commit -m "Auto-sync from server $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin master
fi

# 2. Pull updates from GitHub
echo "Pulling updates from GitHub..."
git pull origin master
"""
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        # Use printf to write the content to avoid shell expansion issues
        stdin, stdout, stderr = client.exec_command(f"cat << 'EOF' > /var/www/svms/git_sync.sh\n{script_content}\nEOF\nchmod +x /var/www/svms/git_sync.sh")
        print(stdout.read().decode())
        print(stderr.read().decode())
        client.close()
        print("Updated git_sync.sh on server.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_git_sync()
