import paramiko

def fix_server_structure():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    target_dir = "/var/www/svms/backend"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to server.")
        
        # We'll use a python script ON the server to fix the structure
        # I'll upload the local fix_structure.py (modified for linux) and run it
        
        # Modify for linux paths
        script_content = r"""
import os
import shutil
import re

def fix_structure():
    root_dir = "/var/www/svms/backend"
    
    # Ensure target directories exist
    os.makedirs(os.path.join(root_dir, "app", "Http", "Controllers"), exist_ok=True)
    os.makedirs(os.path.join(root_dir, "app", "Models"), exist_ok=True)
    os.makedirs(os.path.join(root_dir, "database", "migrations"), exist_ok=True)
    os.makedirs(os.path.join(root_dir, "app", "Console", "Commands"), exist_ok=True)
    
    files = [f for f in os.listdir(root_dir) if os.path.isfile(os.path.join(root_dir, f)) and f.endswith(".php")]
    
    for f in files:
        file_path = os.path.join(root_dir, f)
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as content_file:
            content = content_file.read()
            
        # Check namespace
        if "namespace App\\Http\\Controllers" in content:
            target = os.path.join(root_dir, "app", "Http", "Controllers", f)
            print(f"Moving {f} to app/Http/Controllers")
            shutil.move(file_path, target)
        elif "namespace App\\Models" in content:
            target = os.path.join(root_dir, "app", "Models", f)
            print(f"Moving {f} to app/Models")
            shutil.move(file_path, target)
        elif "namespace App\\Console\\Commands" in content:
            target = os.path.join(root_dir, "app", "Console", "Commands", f)
            print(f"Moving {f} to app/Console/Commands")
            shutil.move(file_path, target)
        elif re.match(r"\d{4}_\d{2}_\d{2}_\d{6}_.*\.php", f):
            target = os.path.join(root_dir, "database", "migrations", f)
            print(f"Moving {f} to database/migrations")
            shutil.move(file_path, target)

if __name__ == "__main__":
    fix_structure()
"""
        # Save script on server
        sftp = client.open_sftp()
        with sftp.file("/tmp/fix_structure_server.py", "w") as f:
            f.write(script_content)
        sftp.close()
        
        # Run script
        stdin, stdout, stderr = client.exec_command("python3 /tmp/fix_structure_server.py")
        print(stdout.read().decode())
        print(stderr.read().decode())
        
        client.close()
        print("Server structure fixed.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_server_structure()
