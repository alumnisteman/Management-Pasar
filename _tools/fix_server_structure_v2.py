import paramiko

def fix_server_structure_v2():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    target_dir = "/var/www/svms/backend"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to server.")
        
        # Upload the updated fix_structure.py (modified for linux)
        script_content = r"""
import os
import shutil
import re

def fix_structure():
    root_dir = "/var/www/svms/backend"
    
    files = [f for f in os.listdir(root_dir) if os.path.isfile(os.path.join(root_dir, f)) and f.endswith(".php")]
    
    for f in files:
        file_path = os.path.join(root_dir, f)
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as content_file:
            content = content_file.read()
            
        # Check namespace
        if "namespace App\\Http\\Controllers" in content:
            target_dir_path = os.path.join(root_dir, "app", "Http", "Controllers")
        elif "namespace App\\Models" in content:
            target_dir_path = os.path.join(root_dir, "app", "Models")
        elif "namespace App\\Console\\Commands" in content:
            target_dir_path = os.path.join(root_dir, "app", "Console", "Commands")
        elif "namespace App\\Services" in content:
            target_dir_path = os.path.join(root_dir, "app", "Services")
        elif "namespace App\\Http\\Middleware" in content:
            target_dir_path = os.path.join(root_dir, "app", "Http", "Middleware")
        elif "namespace App\\Listeners" in content:
            target_dir_path = os.path.join(root_dir, "app", "Listeners")
        elif "namespace Database\\Seeders" in content:
            target_dir_path = os.path.join(root_dir, "database", "seeders")
        elif re.match(r"\d{4}_\d{2}_\d{2}_\d{6}_.*\.php", f):
            target_dir_path = os.path.join(root_dir, "database", "migrations")
        else:
            continue
            
        os.makedirs(target_dir_path, exist_ok=True)
        target = os.path.join(target_dir_path, f)
        print(f"Moving {f} to {os.path.relpath(target_dir_path, root_dir)}")
        shutil.move(file_path, target)

if __name__ == "__main__":
    fix_structure()
"""
        sftp = client.open_sftp()
        with sftp.file("/tmp/fix_structure_server_v2.py", "w") as f:
            f.write(script_content)
        sftp.close()
        
        # Run script
        stdin, stdout, stderr = client.exec_command("python3 /tmp/fix_structure_server_v2.py")
        print(stdout.read().decode())
        print(stderr.read().decode())
        
        # Important: Refresh autoloader inside the container
        print("Refreshing autoloader in container...")
        client.exec_command("docker exec svms-app-1 composer dump-autoload")
        
        client.close()
        print("Server structure fixed.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_server_structure_v2()
