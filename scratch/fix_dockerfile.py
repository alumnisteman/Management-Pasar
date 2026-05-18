import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def fix_dockerfiles():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        # 1. Update /var/www/steman-alumni/Dockerfile
        print("=== Updating /var/www/steman-alumni/Dockerfile ===")
        cmd_read = "cat /var/www/steman-alumni/Dockerfile"
        stdin, stdout, stderr = client.exec_command(cmd_read)
        content = stdout.read().decode('utf-8')
        
        target = "RUN composer dump-autoload --optimize --no-dev && ls -la /app/vendor/autoload.php"
        replacement = "RUN composer dump-autoload --optimize --no-dev --no-scripts && ls -la /app/vendor/autoload.php"
        
        if target in content:
            new_content = content.replace(target, replacement)
            # Write new content back
            # Use printf to write to avoid shell expansion issues
            sftp = client.open_sftp()
            with sftp.file("/var/www/steman-alumni/Dockerfile", "w") as f:
                f.write(new_content)
            sftp.close()
            print("Successfully updated /var/www/steman-alumni/Dockerfile!")
        else:
            print("Target string not found in Dockerfile.")
            
        # 2. Update /var/www/steman-alumni/Dockerfile.prod (if exists)
        print("\n=== Checking /var/www/steman-alumni/Dockerfile.prod ===")
        stdin, stdout, stderr = client.exec_command("ls -la /var/www/steman-alumni/Dockerfile.prod")
        out = stdout.read().decode('utf-8')
        if "Dockerfile.prod" in out:
            stdin, stdout, stderr = client.exec_command("cat /var/www/steman-alumni/Dockerfile.prod")
            prod_content = stdout.read().decode('utf-8')
            if target in prod_content:
                new_prod_content = prod_content.replace(target, replacement)
                sftp = client.open_sftp()
                with sftp.file("/var/www/steman-alumni/Dockerfile.prod", "w") as f:
                    f.write(new_prod_content)
                sftp.close()
                print("Successfully updated /var/www/steman-alumni/Dockerfile.prod!")
            else:
                print("Target string not found in Dockerfile.prod.")
        else:
            print("Dockerfile.prod does not exist.")
            
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_dockerfiles()
