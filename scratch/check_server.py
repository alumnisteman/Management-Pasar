import paramiko

def run_ssh_commands():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    commands = [
        "uname -a",
        "ls -la /var/www",
        "ls -la /var/www/svms",
        "docker ps -a",
        "cd /var/www/svms/backend && git remote -v && git status && git log -n 3 --oneline",
        "cd /var/www/svms && ls -la"
    ]
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        print(f"Connecting to {host}...")
        client.connect(host, username=user, password=password)
        print("Connected! Running commands...\n")
        
        for cmd in commands:
            print(f"=== Running: {cmd} ===")
            stdin, stdout, stderr = client.exec_command(cmd)
            out = stdout.read().decode('utf-8', errors='ignore')
            err = stderr.read().decode('utf-8', errors='ignore')
            if out:
                print("STDOUT:")
                print(out)
            if err:
                print("STDERR:")
                print(err)
            print("="*40 + "\n")
            
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    run_ssh_commands()
