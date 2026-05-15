import paramiko
import os

host = '103.175.219.57'
user = 'root'
password = 'M4ruw4h3@'

local_path = r'd:\MP\resources\views\landing.blade.php'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, username=user, password=password)

sftp = ssh.open_sftp()

if os.path.exists(local_path):
    remote_path = '/var/www/svms/backend/' + local_path.replace('d:\\MP\\', '').replace('\\', '/')
    print(f"Uploading {local_path} to {remote_path}")
    sftp.put(local_path, remote_path)
else:
    print(f"File not found: {local_path}")

print("Upload complete. Running maintenance script to clear caches...")
stdin, stdout, stderr = ssh.exec_command('cd /var/www/svms && ./deploy.sh')
print(stdout.read().decode())
print(stderr.read().decode())

sftp.close()
ssh.close()
