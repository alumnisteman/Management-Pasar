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
        
        # Script to search all tables in MySQL for a specific string
        sql_search = """
        SET @search_term = 'BILL-2026-05-001';
        SELECT DISTINCT TABLE_NAME, COLUMN_NAME 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = 'svms' AND DATA_TYPE IN ('char', 'varchar', 'text', 'mediumtext', 'longtext');
        """
        
        # We will fetch all text columns and then query them for the string
        stdin, stdout, stderr = client.exec_command('docker exec svms-mysql-1 mysql -u root -proot -e "SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = \'svms\' AND DATA_TYPE IN (\'char\', \'varchar\', \'text\', \'mediumtext\', \'longtext\');"')
        
        lines = stdout.read().decode('utf-8').strip().split('\n')[1:] # Skip header
        
        print("=== Searching for BILL-2026-05-001 in all tables ===")
        for line in lines:
            if not line:
                continue
            table, column = line.split('\t')
            query = f"SELECT count(*) as count FROM svms.{table} WHERE `{column}` LIKE '%BILL-2026-05-001%';"
            stdin2, stdout2, stderr2 = client.exec_command(f'docker exec svms-mysql-1 mysql -u root -proot -N -e "{query}"')
            count = stdout2.read().decode('utf-8').strip()
            if count and int(count) > 0:
                print(f"Found in Table: {table}, Column: {column} (Count: {count})")
                
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check()
