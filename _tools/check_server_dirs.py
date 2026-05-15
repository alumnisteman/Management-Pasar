import paramiko

def check_dirs():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        for d in ["/var/www/svms", "/var/www/steman-alumni", "/var/www/porter"]:
            stdin, stdout, stderr = client.exec_command(f"ls -la {d}")
            print(f"Contents of {d}:")
            print(stdout.read().decode())
            print("-" * 20)
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_dirs()
