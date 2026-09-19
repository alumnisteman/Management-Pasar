import paramiko

def run_migration():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        stdin, stdout, stderr = client.exec_command('docker exec svms-app-1 php artisan migrate --force')
        out = stdout.read().decode('utf-8', errors='replace')
        err = stderr.read().decode('utf-8', errors='replace')
        with open('migration_output.txt', 'w', encoding='utf-8') as f:
            f.write("OUTPUT:\n")
            f.write(out)
            f.write("\nERROR:\n")
            f.write(err)
        print("Migration output saved to migration_output.txt")
    finally:
        client.close()

if __name__ == "__main__":
    run_migration()
