import paramiko
import base64
import os

def deploy():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=user, password=password)
    
    with open("landing.html", 'rb') as f:
        content = base64.b64encode(f.read()).decode('utf-8')
    
    print("Deploying to NGINX container...")
    client.exec_command(f"docker exec svms-dashboard-1 sh -c 'echo {content} | base64 -d > /usr/share/nginx/html/landing.html'")
    client.exec_command(f"docker exec svms-dashboard-1 sh -c 'echo {content} | base64 -d > /usr/share/nginx/html/index.html'")
    
    print("Deploying to Laravel welcome.blade.php...")
    remote_path = "/var/www/svms/backend/resources/views/welcome.blade.php"
    client.exec_command(f"echo '{content}' | base64 -d > {remote_path}")
    
    print("Running optimization inside backend container...")
    client.exec_command("docker exec svms-app-1 php artisan view:clear")
    
    client.close()
    print("Deployment finished.")

if __name__ == "__main__":
    deploy()
