import paramiko
import base64
import os

def deploy_backend_updates(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        
        files_to_deploy = [
            ("app/Http/Controllers/CommandCenterController.php", "/var/www/svms/backend/app/Http/Controllers/CommandCenterController.php"),
            ("api.php", "/var/www/svms/backend/routes/api.php"),
            ("TraderVerificationController.php", "/var/www/svms/backend/app/Http/Controllers/TraderVerificationController.php"),
            ("app/Models/Complaint.php", "/var/www/svms/backend/app/Models/Complaint.php"),
            ("app/Http/Controllers/PermitController.php", "/var/www/svms/backend/app/Http/Controllers/PermitController.php"),
            ("app/Models/Slot.php", "/var/www/svms/backend/app/Models/Slot.php"),
            ("GridController.php", "/var/www/svms/backend/app/Http/Controllers/GridController.php"),
            ("MarketController.php", "/var/www/svms/backend/app/Http/Controllers/MarketController.php"),
            ("PelatihanController.php", "/var/www/svms/backend/app/Http/Controllers/PelatihanController.php"),
            ("ReportController.php", "/var/www/svms/backend/app/Http/Controllers/ReportController.php"),
            ("SystemDoctor.php", "/var/www/svms/backend/app/Console/Commands/SystemDoctor.php"),
            ("SystemTune.php", "/var/www/svms/backend/app/Console/Commands/SystemTune.php"),
            ("app/Services/AIService.php", "/var/www/svms/backend/app/Services/AIService.php"),
            ("AISummaryController.php", "/var/www/svms/backend/app/Http/Controllers/AISummaryController.php")
        ]
        
        for local, remote in files_to_deploy:
            print(f"Deploying {local} to {remote}...")
            # Ensure remote directory exists
            remote_dir = os.path.dirname(remote)
            client.exec_command(f"mkdir -p {remote_dir}")
            
            if os.path.exists(local):
                with open(local, 'rb') as f:
                    content = f.read()
                    encoded = base64.b64encode(content).decode('utf-8')
                client.exec_command(f"echo '{encoded}' | base64 -d > {remote}")
            else:
                print(f"Local file {local} not found!")
                
        print("Clearing routes cache...")
        client.exec_command("docker exec svms-app-1 php artisan route:clear")
        
        print("Backend updates deployed successfully.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    deploy_backend_updates("103.175.219.57", "root", "M4ruw4h3@")
