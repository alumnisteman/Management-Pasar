import paramiko

def build_web_on_server_v2():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    web_dir = "/var/www/svms/apps/web"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to server.")
        
        # Install with --legacy-peer-deps and build
        commands = [
            f"cd {web_dir} && npm install --legacy-peer-deps --no-audit --no-fund",
            f"cd {web_dir} && npm run build"
        ]
        
        for cmd in commands:
            print(f"Running: {cmd}")
            stdin, stdout, stderr = client.exec_command(cmd)
            # We'll just wait for completion this time
            out = stdout.read().decode()
            err = stderr.read().decode()
            if out: print(out)
            if err: print(err)
            
        client.close()
        print("Web app build attempted again.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    build_web_on_server_v2()
