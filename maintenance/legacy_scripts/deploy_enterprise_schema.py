import paramiko
import os

def deploy():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    files_to_deploy = [
        ("2026_05_11_000002_enterprise_schema_alignment.php", "/var/www/svms/backend/database/migrations/2026_05_11_000002_enterprise_schema_alignment.php")
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
            
    print("Running migrations...")
    stdin, stdout, stderr = client.exec_command("docker exec svms-app-1 php artisan migrate --force")
    print(stdout.read().decode())
    print(stderr.read().decode())
    
    client.close()
    print("Enterprise migration finished.")

if __name__ == "__main__":
    deploy()
