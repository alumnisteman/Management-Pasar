import paramiko

def check_symlinks():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    commands = [
        "ls -la /var/www/svms",
        "ls -la /var/www/svms/apps",
        "ls -la /var/www/svms/backend/apps"
    ]
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
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
    check_symlinks()
