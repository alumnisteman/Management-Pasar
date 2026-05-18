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
        stdin, stdout, stderr = client.exec_command("find /var/www/svms/backend/database/migrations -name '*_create_iot_and_traffic_tables.php'")
        print("Migration on server filesystem:")
        print(stdout.read().decode('utf-8'))
        
        stdin, stdout, stderr = client.exec_command("find /var/www/svms/backend/app/Models -name '*Reading*'")
        print("Models on server filesystem:")
        print(stdout.read().decode('utf-8'))
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check()
