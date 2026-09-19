import paramiko
import base64
import os

def deploy_all_fixes(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        
        files = [
            ("app/Models/Slot.php", "/var/www/svms/backend/app/Models/Slot.php"),
            ("resources/views/id_card.blade.php", "/var/www/svms/backend/resources/views/id_card.blade.php"),
            ("routes/web.php", "/var/www/svms/backend/routes/web.php"),
        ]
        
        for local, remote in files:
            if not os.path.exists(local):
                print(f"Skipping {local} - not found locally")
                continue
            print(f"Deploying {local}...")
            remote_dir = os.path.dirname(remote)
            client.exec_command(f"mkdir -p {remote_dir}")
            with open(local, 'rb') as f:
                encoded = base64.b64encode(f.read()).decode('utf-8')
            stdin, stdout, stderr = client.exec_command(f"echo '{encoded}' | base64 -d > {remote}")
            stdout.channel.recv_exit_status()

        print("Clearing caches...")
        stdin, stdout, stderr = client.exec_command("docker exec svms-app-1 php artisan route:clear && docker exec svms-app-1 php artisan view:clear && docker exec svms-app-1 php artisan config:clear")
        stdout.channel.recv_exit_status()
        print(stdout.read().decode())
        
        print("All fixes deployed successfully.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    deploy_all_fixes("103.175.219.57", "root", "M4ruw4h3@")
