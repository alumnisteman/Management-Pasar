import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def check():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        print("=== Running only our new migration ===")
        cmd = 'docker exec svms-app-1 php artisan migrate --path=database/migrations/2026_05_18_100000_create_iot_and_traffic_tables.php --force'
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode('utf-8'))
        print(stderr.read().decode('utf-8'))
        
        print("=== Checking migrate:status again ===")
        stdin, stdout, stderr = client.exec_command('docker exec svms-app-1 php artisan migrate:status')
        print(stdout.read().decode('utf-8'))
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check()
