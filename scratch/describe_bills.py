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
        print("=== Columns in bills table ===")
        stdin, stdout, stderr = client.exec_command('docker exec svms-mysql-1 mysql -u root -proot -e "USE svms; DESCRIBE bills;"')
        print(stdout.read().decode('utf-8'))
        
        print("=== Content of bills table ===")
        stdin, stdout, stderr = client.exec_command('docker exec svms-mysql-1 mysql -u root -proot -e "USE svms; SELECT * FROM bills LIMIT 5;"')
        print(stdout.read().decode('utf-8'))
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check()
