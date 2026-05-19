import paramiko
import os

def main():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    remote_path = "/var/www/svms/backend/composer.lock"
    local_path = "d:/MP/composer.lock"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        print(f"Connecting to {host} via SSH...")
        client.connect(host, username=user, password=password)
        
        sftp = client.open_sftp()
        print(f"Downloading: {remote_path} -> {local_path}")
        sftp.get(remote_path, local_path)
        sftp.close()
        print("composer.lock downloaded successfully!")
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    main()
