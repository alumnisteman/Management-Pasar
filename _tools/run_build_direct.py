import paramiko

def run_build_direct():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    web_dir = "/var/www/svms/apps/web"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to server.")
        
        # Run build directly and read output
        stdin, stdout, stderr = client.exec_command(f"cd {web_dir} && ./node_modules/.bin/react-router build")
        
        print("Build Output:")
        # We'll use a timeout to read whatever we can
        import time
        start_time = time.time()
        while time.time() - start_time < 30: # Wait for 30 seconds
            if stdout.channel.recv_ready():
                print(stdout.channel.recv(1024).decode('utf-8', errors='replace'), end="")
            if stderr.channel.recv_ready():
                print(stderr.channel.recv(1024).decode('utf-8', errors='replace'), end="")
            if stdout.channel.exit_status_ready():
                break
            time.sleep(1)
            
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    run_build_direct()
