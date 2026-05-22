import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

commands = [
    ('ENV check', 'grep -E "VIEW|CACHE|APP_" /var/www/svms/backend/.env'),
    ('view.php config', 'cat /var/www/svms/backend/config/view.php'),
    ('storage/framework ls', 'ls -la /var/www/svms/backend/storage/framework/'),
    ('storage/framework/views ls', 'ls -la /var/www/svms/backend/storage/framework/views/'),
]

for label, cmd in commands:
    print(f'\n{"="*60}')
    print(f'=== {label} ===')
    print(f'CMD: {cmd}')
    print('='*60)
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out:
        print(out)
    if err:
        print('STDERR:', err)

# Now fix: create the views cache dir and fix permissions
print('\n' + '='*60)
print('=== FIXING: Creating cache dirs & fixing permissions ===')
fix_cmds = [
    'mkdir -p /var/www/svms/backend/storage/framework/views',
    'mkdir -p /var/www/svms/backend/storage/framework/cache/data',
    'mkdir -p /var/www/svms/backend/storage/framework/sessions',
    'mkdir -p /var/www/svms/backend/storage/logs',
    'mkdir -p /var/www/svms/backend/bootstrap/cache',
    'chmod -R 775 /var/www/svms/backend/storage',
    'chmod -R 775 /var/www/svms/backend/bootstrap/cache',
    'chown -R www-data:www-data /var/www/svms/backend/storage',
    'chown -R www-data:www-data /var/www/svms/backend/bootstrap/cache',
    'cd /var/www/svms/backend && php artisan config:clear 2>&1',
    'cd /var/www/svms/backend && php artisan cache:clear 2>&1',
    'cd /var/www/svms/backend && php artisan view:clear 2>&1',
    'cd /var/www/svms/backend && php artisan config:cache 2>&1',
]

for cmd in fix_cmds:
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode()
    err = stderr.read().decode()
    print(f'\n>> {cmd}')
    if out: print(out)
    if err: print('ERR:', err)

ssh.close()
print('\nDone!')
