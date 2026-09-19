import paramiko
import base64
import os

def deploy_admin_fix(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        
        files_to_deploy = [
            ("routes/web.php", "/var/www/svms/backend/routes/web.php"),
            ("resources/views/admin.blade.php", "/var/www/svms/backend/resources/views/admin.blade.php")
        ]
        
        for local_path, remote_path in files_to_deploy:
            print(f"Deploying {local_path} to {remote_path}...")
            with open(local_path, 'rb') as f:
                content = f.read()
                encoded = base64.b64encode(content).decode('utf-8')
            
            # Ensure directory exists on server
            remote_dir = os.path.dirname(remote_path)
            client.exec_command(f"mkdir -p {remote_dir}")
            
            # Upload file
            client.exec_command(f"echo '{encoded}' | base64 -d > {remote_path}")
            
        print("Running optimization inside container...")
        client.exec_command("docker exec svms-app-1 php artisan route:clear")
        client.exec_command("docker exec svms-app-1 php artisan view:clear")
        
        print("Admin route fix deployed successfully.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    deploy_admin_fix("103.175.219.57", "root", "M4ruw4h3@")
