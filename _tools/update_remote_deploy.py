import paramiko

def main():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    script_content = """#!/bin/bash
echo "Starting SVMS Deployment Automation..."
cd /var/www/svms

# Build and start services including frontend
docker compose up -d --build app worker frontend

# Laravel Production Optimization
echo "Optimizing Laravel..."
docker compose exec -T app php artisan config:cache
docker compose exec -T app php artisan route:cache
docker compose exec -T app php artisan view:cache
docker compose exec -T app php artisan optimize

echo "Deployment Successful!"
"""

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        sftp = client.open_sftp()
        with sftp.file('/var/www/svms/deploy.sh', 'w') as f:
            f.write(script_content)
        sftp.close()
        
        # chmod +x
        client.exec_command('chmod +x /var/www/svms/deploy.sh')
        print("Updated deploy.sh successfully on the server.")
    finally:
        client.close()

if __name__ == "__main__":
    main()
