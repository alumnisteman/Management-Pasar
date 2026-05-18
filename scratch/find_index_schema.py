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
        print("=== Searching for index in information_schema ===")
        query = "SELECT TABLE_NAME, CONSTRAINT_NAME, CONSTRAINT_TYPE FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME LIKE '%bills_invoice_number_unique%' OR CONSTRAINT_NAME LIKE '%invoice_number%';"
        stdin, stdout, stderr = client.exec_command(f'docker exec svms-mysql-1 mysql -u root -proot -e "{query}"')
        print(stdout.read().decode('utf-8'))
        
        print("=== Searching for any column named invoice_number ===")
        query = "SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS WHERE COLUMN_NAME LIKE '%invoice_number%' OR COLUMN_NAME LIKE '%bill_number%';"
        stdin, stdout, stderr = client.exec_command(f'docker exec svms-mysql-1 mysql -u root -proot -e "{query}"')
        print(stdout.read().decode('utf-8'))
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check()
