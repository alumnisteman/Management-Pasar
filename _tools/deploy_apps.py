import os
import shutil
import paramiko
import zipfile

def deploy_apps():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    # 1. Zip local apps
    print("Zipping apps...")
    local_apps_path = r"d:\MP\apps"
    zip_path = r"d:\MP\apps.zip"
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(local_apps_path):
            # Skip node_modules and .git
            if "node_modules" in dirs:
                dirs.remove("node_modules")
            if ".git" in dirs:
                dirs.remove(".git")
            if ".vitest" in dirs:
                dirs.remove(".vitest")
            
            for file in files:
                rel_path = os.path.relpath(os.path.join(root, file), os.path.join(local_apps_path, ".."))
                zipf.write(os.path.join(root, file), rel_path)
    
    print(f"Zip created: {zip_path}")
    
    # 2. Upload to server
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        sftp = client.open_sftp()
        print("Uploading zip...")
        sftp.put(zip_path, "/tmp/apps.zip")
        sftp.close()
        
        # 3. Extract on server
        print("Extracting on server...")
        client.exec_command("mkdir -p /var/www/svms/apps")
        client.exec_command("unzip -o /tmp/apps.zip -d /var/www/svms/")
        
        print("Apps deployed to server.")
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    deploy_apps()
