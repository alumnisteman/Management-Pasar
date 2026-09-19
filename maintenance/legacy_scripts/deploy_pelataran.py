import paramiko
import os

def deploy():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    files_to_deploy = [
        ("PelataranSeeder.php", "/var/www/svms/backend/database/seeders/PelataranSeeder.php")
    ]
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=user, password=password)
    sftp = client.open_sftp()
    
    for local_path, remote_path in files_to_deploy:
        sftp.put(local_path, remote_path)
        container_path = remote_path.split("/backend/")[1]
        client.exec_command(f"docker cp {remote_path} svms-app-1:/var/www/{container_path}")
            
    print("Running seeder...")
    client.exec_command("docker exec svms-app-1 php artisan db:seed --class=PelataranSeeder")
    
    client.close()
    print("Pelataran setup finished.")

if __name__ == "__main__":
    deploy()
