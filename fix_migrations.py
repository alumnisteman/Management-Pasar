import paramiko

def fix_migrations():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        
        # Insert record for settings table migration
        cmd1 = "docker exec svms-mysql-1 mysql -u root -proot svms -e \"INSERT INTO migrations (migration, batch) SELECT '2026_05_07_102356_create_settings_table', 1 WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE migration = '2026_05_07_102356_create_settings_table');\""
        client.exec_command(cmd1)
        print("Settings migration record ensured.")
        
        # Now run migrate again
        stdin, stdout, stderr = client.exec_command('docker exec svms-app-1 php artisan migrate --force')
        print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    fix_migrations()
