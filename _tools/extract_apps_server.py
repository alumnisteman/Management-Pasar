import paramiko

def extract_apps_server():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to server.")
        
        # Try to extract and see output
        stdin, stdout, stderr = client.exec_command("cd /var/www/svms && unzip -o /tmp/apps.zip")
        print("Unzip output:")
        print(stdout.read().decode())
        print("Unzip error:")
        print(stderr.read().decode())
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_apps_server()
