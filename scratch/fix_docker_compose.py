import paramiko

def fix_compose(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=user, password=password)
    
    # Read the current file
    stdin, stdout, stderr = client.exec_command("cat /var/www/svms/docker-compose.yml")
    content = stdout.read().decode('utf-8')
    
    # Replace the command
    new_content = content.replace(
        'command: ["sh", "-c", "npm install @react-router/dev --legacy-peer-deps && node build/server/index.js"]',
        'command:\n    - node\n    - build/server/index.js'
    )
    
    # Write back
    sftp = client.open_sftp()
    with sftp.file("/var/www/svms/docker-compose.yml", "w") as f:
        f.write(new_content)
    sftp.close()
    
    # Restart frontend
    print("Restarting frontend container...")
    stdin, stdout, stderr = client.exec_command("cd /var/www/svms && docker compose up -d frontend")
    print(stdout.read().decode('utf-8'))
    print(stderr.read().decode('utf-8'))
    
    client.close()

if __name__ == "__main__":
    fix_compose("103.175.219.57", "root", "M4ruw4h3@")
