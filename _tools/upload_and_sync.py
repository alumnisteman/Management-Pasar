import os
import paramiko

def create_remote_dir(sftp, remote_dir):
    path_parts = [p for p in remote_dir.split('/') if p]
    current = ""
    if remote_dir.startswith('/'):
        current = "/"
    
    for part in path_parts:
        current = os.path.join(current, part).replace('\\', '/')
        try:
            sftp.stat(current)
        except IOError:
            print(f"Creating remote directory: {current}")
            sftp.mkdir(current)

def main():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    local_base = "d:/MP"
    remote_base = "/var/www/svms/backend"
    
    FILES_TO_SYNC = [
        "app/Http/Controllers/TenantPortalController.php",
        "apps/web/src/app/tenant/page.jsx",
        "apps/web/src/app/api/tenant/pay-bill/route.js",
        "apps/web/src/app/api/tenant/traders/route.js",
        "apps/web/src/app/admin/stall-map/page.jsx",
        "apps/web/src/app/api/admin/stall-map/route.js",
        "apps/web/src/app/page.jsx"
    ]
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        print(f"Connecting to {host} via SSH...")
        client.connect(host, username=user, password=password)
        sftp = client.open_sftp()
        
        for relative_path in FILES_TO_SYNC:
            local_path = os.path.join(local_base, relative_path).replace('\\', '/')
            remote_path = os.path.join(remote_base, relative_path).replace('\\', '/')
            
            if not os.path.exists(local_path):
                print(f"WARNING: Local file does not exist: {local_path}")
                continue
                
            remote_dir = os.path.dirname(remote_path)
            create_remote_dir(sftp, remote_dir)
            
            print(f"Uploading: {relative_path} -> {remote_path}")
            sftp.put(local_path, remote_path)
            
        sftp.close()
        print("Upload completed! Running git_sync.sh on server...")
        
        stdin, stdout, stderr = client.exec_command("/var/www/svms/git_sync.sh")
        print("STDOUT:")
        print(stdout.read().decode())
        print("STDERR:")
        print(stderr.read().decode())
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    main()
