import paramiko

def check_env():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        # Check potential .env locations
        paths = [
            "/var/www/svms/backend/.env",
            "/var/www/svms/dashboard/.env",
            "/var/www/svms/.env"
        ]
        
        for p in paths:
            stdin, stdout, stderr = client.exec_command(f"cat {p}")
            content = stdout.read().decode()
            if content:
                print(f"Content of {p}:")
                # Mask potential secrets but show enough to identify
                for line in content.splitlines():
                    if "DATABASE_URL" in line:
                        print(line[:20] + "...")
                    elif "=" in line:
                        k, v = line.split("=", 1)
                        print(f"{k}=...")
                    else:
                        print(line)
                print("-" * 20)
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_env()
