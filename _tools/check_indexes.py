import paramiko

def check_indexes():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        tables = ['slots', 'traders', 'permits', 'payments', 'audit_logs']
        for table in tables:
            print(f"--- Indexes for {table} ---")
            cmd = f'docker exec svms-mysql-1 mysql -u root -proot svms -e "SHOW INDEX FROM {table};"'
            stdin, stdout, stderr = client.exec_command(cmd)
            print(stdout.read().decode())
    finally:
        client.close()

if __name__ == "__main__":
    check_indexes()
