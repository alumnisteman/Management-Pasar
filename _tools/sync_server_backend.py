import paramiko

def sync_server_backend():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    repo_url = "https://github.com/alumnisteman/Management-Pasar.git"
    target_dir = "/var/www/svms/backend"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to server.")
        
        # 1. Initialize git if not exists
        commands = [
            f"cd {target_dir} && if [ ! -d .git ]; then git init && git remote add origin {repo_url}; fi",
            f"cd {target_dir} && git fetch origin",
            # We use -f to force sync, but we might want to stash local changes if any .env exists
            f"cd {target_dir} && git reset --hard origin/master"
        ]
        
        for cmd in commands:
            print(f"Running: {cmd}")
            stdin, stdout, stderr = client.exec_command(cmd)
            out = stdout.read().decode()
            err = stderr.read().decode()
            if out: print(out)
            if err: print(err)
            
        client.close()
        print("Backend synchronized.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    sync_server_backend()
