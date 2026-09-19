import paramiko

def check_tables():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        tables = ['permits', 'traders', 'slots', 'markets', 'zones', 'audit_logs', 'payments', 'price_logs']
        for table in tables:
            tinker_cmd = f"echo Schema::hasTable('{table}') ? '{table}: OK' : '{table}: MISSING';"
            full_cmd = f'docker exec svms-app-1 php artisan tinker --execute="{tinker_cmd}"'
            stdin, stdout, stderr = client.exec_command(full_cmd)
            print(stdout.read().decode().strip())
    finally:
        client.close()

if __name__ == "__main__":
    check_tables()
