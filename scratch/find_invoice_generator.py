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
        print("=== Searching for BILL- on server ===")
        stdin, stdout, stderr = client.exec_command("grep -rn 'BILL-' /var/www/svms/backend/app")
        print(stdout.read().decode('utf-8'))
        
        print("=== Searching for invoice_number on server ===")
        stdin, stdout, stderr = client.exec_command("grep -rn 'invoice_number' /var/www/svms/backend/app")
        print(stdout.read().decode('utf-8'))
        
        print("=== Searching in seeders on server ===")
        stdin, stdout, stderr = client.exec_command("grep -rn 'BILL-' /var/www/svms/backend/database")
        print(stdout.read().decode('utf-8'))
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check()
