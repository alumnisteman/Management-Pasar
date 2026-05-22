import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

stdin, stdout, stderr = ssh.exec_command('grep -A 15 "local.ERROR" /var/www/svms/backend/storage/logs/laravel.log | tail -n 60')
print(stdout.read().decode())
