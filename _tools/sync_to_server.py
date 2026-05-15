import paramiko
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '103.175.219.57'
USER = 'root'
PASS = 'M4ruw4h3@'
LOCAL_BASE = r'd:\MP\apps\web'
REMOTE_BASE = '/var/www/svms/apps/web'

# Directories to sync
SYNC_DIRS = ['src', '__create', 'plugins']
# Individual files to sync at root
SYNC_FILES = ['react-router.config.ts', 'vite.config.ts', 'package.json', 
              'tsconfig.json', 'postcss.config.js', 'tailwind.config.js']

def upload_tree(sftp, local_dir, remote_dir, skips=None):
    skips = skips or []
    uploaded = 0
    errors = 0
    try:
        sftp.mkdir(remote_dir)
    except:
        pass
    
    for item in os.listdir(local_dir):
        if item in skips or item.startswith('.'):
            continue
        local_path = os.path.join(local_dir, item)
        remote_path = remote_dir + '/' + item
        
        if os.path.isdir(local_path):
            u, e = upload_tree(sftp, local_path, remote_path, skips)
            uploaded += u
            errors += e
        else:
            try:
                sftp.put(local_path, remote_path)
                uploaded += 1
            except Exception as ex:
                print(f'  ERROR uploading {local_path}: {ex}')
                errors += 1
    return uploaded, errors

def main():
    print(f'Connecting to {HOST}...')
    transport = paramiko.Transport((HOST, 22))
    transport.connect(username=USER, password=PASS)
    sftp = paramiko.SFTPClient.from_transport(transport)
    
    total_uploaded = 0
    total_errors = 0
    
    for d in SYNC_DIRS:
        local_dir = os.path.join(LOCAL_BASE, d)
        remote_dir = REMOTE_BASE + '/' + d
        if os.path.isdir(local_dir):
            print(f'Syncing {d}/ ...')
            u, e = upload_tree(sftp, local_dir, remote_dir)
            print(f'  -> {u} files uploaded, {e} errors')
            total_uploaded += u
            total_errors += e
    
    for f in SYNC_FILES:
        local_path = os.path.join(LOCAL_BASE, f)
        remote_path = REMOTE_BASE + '/' + f
        if os.path.isfile(local_path):
            try:
                sftp.put(local_path, remote_path)
                print(f'Uploaded {f}')
                total_uploaded += 1
            except Exception as ex:
                print(f'ERROR uploading {f}: {ex}')
                total_errors += 1
    
    sftp.close()
    transport.close()
    print(f'\nDone! Total: {total_uploaded} uploaded, {total_errors} errors.')

main()
