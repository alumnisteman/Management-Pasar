import paramiko

def check_backend():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    commands = [
        "ls -la /var/www/svms/backend",
        "ls -la /var/www/svms/backend/apps",
        "cd /var/www/svms/backend && git fetch origin && git log HEAD..origin/master --oneline",
        "cd /var/www/svms/backend && git log -n 5 --oneline"
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
    check_backend()
