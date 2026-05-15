import paramiko

def build_web_on_server_v3():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    web_dir = "/var/www/svms/apps/web"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to server.")
        
        # Build and redirect to file
        cmd = f"cd {web_dir} && npm run build > build.log 2>&1"
        print(f"Running: {cmd}")
        client.exec_command(cmd)
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    build_web_on_server_v3()
