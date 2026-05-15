import paramiko
import os

host = '103.175.219.57'
user = 'root'
password = 'M4ruw4h3@'

# List of files we modified locally
files_to_sync = [
    r'd:\MP\app\Http\Controllers\CommandCenterController.php',
    r'd:\MP\app\Http\Controllers\PorterController.php',
    r'd:\MP\app\Http\Controllers\ReputationController.php',
    r'd:\MP\app\Console\Commands\SystemIntegrityScan.php',
    r'd:\MP\app\Services\GridBookingService.php',
    r'd:\MP\routes\api.php',
    r'd:\MP\resources\views\admin.blade.php'
]

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, username=user, password=password)

sftp = ssh.open_sftp()

for local_path in files_to_sync:
    if os.path.exists(local_path):
        remote_path = '/var/www/svms/' + local_path.replace('d:\\MP\\', '').replace('\\', '/')
        
        # Ensure remote directory exists
        remote_dir = os.path.dirname(remote_path)
        try:
            ssh.exec_command(f'mkdir -p {remote_dir}')
        except:
            pass
            
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
