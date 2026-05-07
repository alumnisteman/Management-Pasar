import paramiko
import os

def run_migration():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
    try:
        stdin, stdout, stderr = client.exec_command('docker exec svms-app-1 php artisan migrate --force')
        out = stdout.read().decode('utf-8', errors='replace')
        err = stderr.read().decode('utf-8', errors='replace')
        # write to files for inspection
        with open('migration_stdout.txt', 'w', encoding='utf-8') as f:
            f.write(out)
        with open('migration_stderr.txt', 'w', encoding='utf-8') as f:
            f.write(err)
        print('Migration executed. Check migration_stdout.txt and migration_stderr.txt')
    finally:
        client.close()

if __name__ == '__main__':
    run_migration()
