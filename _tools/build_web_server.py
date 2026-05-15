import paramiko

def build_web_on_server():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    web_dir = "/var/www/svms/apps/web"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to server.")
        
        # Install and build
        commands = [
            f"cd {web_dir} && npm install --no-audit --no-fund",
            f"cd {web_dir} && npm run build"
        ]
        
        for cmd in commands:
            print(f"Running: {cmd}")
            stdin, stdout, stderr = client.exec_command(cmd)
            # Use a while loop to read output in real-time
            while True:
                line = stdout.readline()
                if not line: break
                print(line, end="")
            
            err = stderr.read().decode()
            if err: print(err)
            
        client.close()
        print("Web app built on server.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    build_web_on_server()
