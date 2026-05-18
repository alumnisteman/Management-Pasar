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
        
        print("=== Clearing caches ===")
        client.exec_command('docker exec svms-app-1 php artisan config:clear')
        client.exec_command('docker exec svms-app-1 php artisan cache:clear')
        client.exec_command('docker exec svms-app-1 php artisan route:clear')
        
        print("=== Running DummyDataSeeder ===")
        stdin, stdout, stderr = client.exec_command('docker exec svms-app-1 php artisan db:seed --class=DummyDataSeeder --force')
        print(stdout.read().decode('utf-8'))
        print(stderr.read().decode('utf-8'))
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check()
