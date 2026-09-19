import paramiko
import base64

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('103.175.219.57', username='root', password='M4ruw4h3@')

with open('DummyDataSeeder.php', 'rb') as f:
    encoded = base64.b64encode(f.read()).decode('utf-8')

remote_path = '/var/www/svms/backend/database/seeders/DummyDataSeeder.php'
command = f"echo '{encoded}' | base64 -d > {remote_path}"
stdin, stdout, stderr = client.exec_command(command)
err = stderr.read().decode('utf-8')

if err:
    print('Upload error:', err)
else:
    print('Uploaded successfully.')
    stdin, stdout, stderr = client.exec_command('docker exec svms-app-1 php artisan db:seed --class=DummyDataSeeder')
    print('Seeder Output:', stdout.read().decode())
    print('Seeder Error:', stderr.read().decode())

client.close()
