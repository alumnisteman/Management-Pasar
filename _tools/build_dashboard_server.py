import paramiko

def build_dashboard_server():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to server.")
        
        # Build dashboard
        print("Starting build...")
        stdin, stdout, stderr = client.exec_command("cd /var/www/svms && /usr/bin/docker compose build --no-cache dashboard")
        
        # Read output in chunks
        import time
        while not stdout.channel.exit_status_ready():
            if stdout.channel.recv_ready():
                print(stdout.channel.recv(1024).decode('utf-8', errors='replace'), end="")
            if stderr.channel.recv_ready():
                print(stderr.channel.recv(1024).decode('utf-8', errors='replace'), end="")
            time.sleep(1)
            
        print("Build finished with exit status:", stdout.channel.recv_exit_status())
        
        # Up dashboard
        print("Starting container...")
        stdin, stdout, stderr = client.exec_command("cd /var/www/svms && /usr/bin/docker compose up -d dashboard")
        print(stdout.read().decode())
        print(stderr.read().decode())
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    build_dashboard_server()
