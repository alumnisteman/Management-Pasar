import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

print("Starting queue worker in background...")
ssh.exec_command('cd /root/news-hybrid && docker compose exec -d app php artisan queue:work redis')

print("Executing manual RSS fetch to test ingestion...")
stdin, stdout, stderr = ssh.exec_command('cd /root/news-hybrid && docker compose exec -T app php artisan news:fetch-rss')

for line in iter(stdout.readline, ''): print(line, end='')
err = stderr.read().decode()
if err: print('STDERR:', err)

ssh.close()
