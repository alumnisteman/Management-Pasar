import paramiko
import base64

def deploy_controller_fix(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        
        file_path = "TraderVerificationController.php"
        remote_path = "/var/www/svms/backend/app/Http/Controllers/TraderVerificationController.php"
        
        print(f"Deploying {file_path}...")
        with open(file_path, 'rb') as f:
            content = f.read()
            encoded = base64.b64encode(content).decode('utf-8')
        
        client.exec_command(f"echo '{encoded}' | base64 -d > {remote_path}")
        print("Controller deployed successfully.")
    finally:
        client.close()

if __name__ == "__main__":
    deploy_controller_fix("103.175.219.57", "root", "M4ruw4h3@")
