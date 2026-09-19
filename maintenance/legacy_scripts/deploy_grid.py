import paramiko
import base64
import os

def deploy_grid_controller(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        
        local = "GridController.php"
        remote = "/var/www/svms/backend/app/Http/Controllers/GridController.php"
        
        if not os.path.exists(local):
            print(f"Skipping {local} - not found locally")
            return

        print(f"Deploying {local}...")
        with open(local, 'rb') as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
        
        stdin, stdout, stderr = client.exec_command(f"echo '{encoded}' | base64 -d > {remote}")
        stdout.channel.recv_exit_status()
        
        # We also need to copy it to the container's /var/www directory, as this path implies a mapped volume or we need to run docker cp
        # Actually in other scripts we did docker exec ... let's just do it directly to container to be safe
        container_remote = "/var/www/app/Http/Controllers/GridController.php"
        cmd = f"echo '{encoded}' | base64 -d > /tmp/GridController.php && docker cp /tmp/GridController.php svms-app-1:{container_remote}"
        stdin, stdout, stderr = client.exec_command(cmd)
        stdout.channel.recv_exit_status()

        print("Clearing routes cache...")
        stdin, stdout, stderr = client.exec_command("docker exec svms-app-1 php artisan route:clear")
        stdout.channel.recv_exit_status()
        
        print("Backend updates deployed successfully.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    deploy_grid_controller("103.175.219.57", "root", "M4ruw4h3@")
