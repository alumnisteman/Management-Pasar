import paramiko
import base64
import sys

def deploy_schema(host, user, password, local_migration):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        
        # 1. Backup and clear migrations directory on server
        # We need to find where svms-app-1 is pointing. 
        # Usually it's /var/www/svms/backend based on my earlier check.
        
        # 2. Upload the new full schema migration
        print(f"Uploading {local_migration}...")
        with open(local_migration, 'rb') as f:
            content = f.read()
            encoded = base64.b64encode(content).decode('utf-8')
        
        # Target the migrations directory in the svms project
        remote_path = f"/var/www/svms/backend/database/migrations/{local_migration}"
        client.exec_command(f"echo '{encoded}' | base64 -d > {remote_path}")
        
        # 3. Run the migration
        print("Running migrations on svms-app-1...")
        
        # Run migration
        cmd = f"docker exec -w /var/www svms-app-1 php artisan migrate --force"
        stdin, stdout, stderr = client.exec_command(cmd)
        out = stdout.read().decode()
        err = stderr.read().decode()
        print(f"STDOUT: {out}")
        print(f"STDERR: {err}")
        
    except Exception as e:
        print(f"Exception: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    deploy_schema("103.175.219.57", "root", "M4ruw4h3@", "2026_05_07_400000_create_price_logs_table.php")
