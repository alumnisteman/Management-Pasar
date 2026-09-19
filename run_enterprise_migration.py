import paramiko

def run_remote_migration():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect('192.168.1.18', username='root', password='1')
    try:
        # First sync the new migration file into backend container
        sync_cmd = "docker cp /var/www/Management-Pasar/database/migrations/. management-pasar-backend-1:/var/www/database/migrations/"
        client.exec_command(sync_cmd)
        
        stdin, stdout, stderr = client.exec_command('docker exec management-pasar-backend-1 php artisan migrate --force')
        out = stdout.read().decode('utf-8', errors='replace')
        err = stderr.read().decode('utf-8', errors='replace')
        print("MIGRATION STDOUT:")
        print(out.encode('ascii', errors='replace').decode('ascii'))
        print("MIGRATION STDERR:")
        print(err.encode('ascii', errors='replace').decode('ascii'))
    finally:
        client.close()

if __name__ == '__main__':
    run_remote_migration()
