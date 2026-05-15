import paramiko

def check_schema():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        tables = ['payments', 'audit_logs']
        for table in tables:
            print(f"--- Schema for {table} ---")
            cmd = f'docker exec svms-mysql-1 mysql -u root -proot svms -e "DESCRIBE {table};"'
            stdin, stdout, stderr = client.exec_command(cmd)
            print(stdout.read().decode())
    finally:
        client.close()

if __name__ == "__main__":
    check_schema()
