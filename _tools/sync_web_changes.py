import paramiko

def sync_web_changes_to_server():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to server.")
        
        # We'll just update the root.tsx file on the server
        local_path = r"d:\MP\apps\web\src\app\root.tsx"
        remote_path = "/var/www/svms/apps/web/src/app/root.tsx"
        
        sftp = client.open_sftp()
        sftp.put(local_path, remote_path)
        
        # Also update the dashboard/src/app/root.tsx (since we copied it there)
        sftp.put(local_path, "/var/www/svms/dashboard/src/app/root.tsx")
        
        # Update react-router.config.ts on server too
        local_config = r"d:\MP\apps\web\react-router.config.ts"
        sftp.put(local_config, "/var/www/svms/apps/web/react-router.config.ts")
        sftp.put(local_config, "/var/www/svms/dashboard/react-router.config.ts")
        
        sftp.close()
        print("Web changes synced to server.")
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    sync_web_changes_to_server()
