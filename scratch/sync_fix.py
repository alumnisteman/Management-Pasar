import paramiko
import os

def main():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to server.")
        
        sftp = client.open_sftp()
        
        # 1. Sync index.ts
        local_index = r"d:\MP\apps\web\__create\index.ts"
        remote_index = "/var/www/svms/backend/apps/web/__create/index.ts"
        print(f"Uploading {local_index} to {remote_index}...")
        sftp.put(local_index, remote_index)
        
        # 2. Sync composer.json
        local_composer = r"d:\MP\composer.json"
        remote_composer = "/var/www/svms/backend/composer.json"
        print(f"Uploading {local_composer} to {remote_composer}...")
        sftp.put(local_composer, remote_composer)
        
        # 3. Sync react-router.config.ts
        local_rr_config = r"d:\MP\apps\web\react-router.config.ts"
        remote_rr_config = "/var/www/svms/backend/apps/web/react-router.config.ts"
        print(f"Uploading {local_rr_config} to {remote_rr_config}...")
        sftp.put(local_rr_config, remote_rr_config)
        
        # 4. Sync layout.jsx
        local_layout = r"d:\MP\apps\web\src\app\layout.jsx"
        remote_layout = "/var/www/svms/backend/apps/web/src/app/layout.jsx"
        print(f"Uploading {local_layout} to {remote_layout}...")
        sftp.put(local_layout, remote_layout)
        
        # 5. Sync admin/layout.jsx
        local_admin_layout = r"d:\MP\apps\web\src\app\admin\layout.jsx"
        remote_admin_layout = "/var/www/svms/backend/apps/web/src/app/admin/layout.jsx"
        print(f"Uploading {local_admin_layout} to {remote_admin_layout}...")
        sftp.put(local_admin_layout, remote_admin_layout)
        
        # 6. Sync package.json
        local_pkg = r"d:\MP\apps\web\package.json"
        remote_pkg = "/var/www/svms/backend/apps/web/package.json"
        print(f"Uploading {local_pkg} to {remote_pkg}...")
        sftp.put(local_pkg, remote_pkg)
        
        # 7. Sync root.tsx
        local_root = r"d:\MP\apps\web\src\app\root.tsx"
        remote_root = "/var/www/svms/backend/apps/web/src/app/root.tsx"
        print(f"Uploading {local_root} to {remote_root}...")
        sftp.put(local_root, remote_root)
        
        # 8. Sync vite.config.ts
        local_vite = r"d:\MP\apps\web\vite.config.ts"
        remote_vite = "/var/www/svms/backend/apps/web/vite.config.ts"
        print(f"Uploading {local_vite} to {remote_vite}...")
        sftp.put(local_vite, remote_vite)
        
        sftp.close()
        print("Upload completed.")
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
