import paramiko
import os

def deploy():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    files_to_deploy = [
        ("Market.php", "/var/www/svms/backend/app/Models/Market.php"),
        ("Zone.php", "/var/www/svms/backend/app/Models/Zone.php"),
        ("Block.php", "/var/www/svms/backend/app/Models/Block.php"),
        ("Slot.php", "/var/www/svms/backend/app/Models/Slot.php"),
        ("Trader.php", "/var/www/svms/backend/app/Models/Trader.php"),
        ("Pelatihan.php", "/var/www/svms/backend/app/Models/Pelatihan.php")
    ]
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=user, password=password)
    sftp = client.open_sftp()
    
    for local_path, remote_path in files_to_deploy:
        print(f"Deploying {local_path} to {remote_path}...")
        sftp.put(local_path, remote_path)
        
        container_path = remote_path.split("/backend/")[1]
        cmd = f"docker cp {remote_path} svms-app-1:/var/www/{container_path}"
        print(f"Running: {cmd}")
        client.exec_command(cmd)
            
    client.close()
    print("Models deployment finished.")

if __name__ == "__main__":
    deploy()
