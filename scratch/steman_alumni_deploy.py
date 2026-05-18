import paramiko
import sys
import io
import time

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def run_deployment():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        print(f"Connecting to server {host}...")
        client.connect(host, username=user, password=password)
        print("Connected successfully!\n")
        
        # 1. Resetting local modifications and pulling from origin/main
        print("--- Step 1: Fetching and hard resetting to origin/main ---")
        cmd_git = (
            "cd /var/www/steman-alumni && "
            "git fetch origin main && "
            "git reset --hard origin/main"
        )
        stdin, stdout, stderr = client.exec_command(cmd_git)
        print(stdout.read().decode('utf-8', errors='replace'))
        print(stderr.read().decode('utf-8', errors='replace'))
        
        # Verify git status
        print("Checking git status after reset:")
        stdin, stdout, stderr = client.exec_command("cd /var/www/steman-alumni && git status -sb")
        print(stdout.read().decode('utf-8', errors='replace'))
        
        # Patch the Dockerfile to use --no-scripts during composer dump-autoload
        print("--- Step 1.5: Applying --no-scripts fix to Dockerfile ---")
        cmd_read = "cat /var/www/steman-alumni/Dockerfile"
        stdin, stdout, stderr = client.exec_command(cmd_read)
        content = stdout.read().decode('utf-8')
        
        target = "RUN composer dump-autoload --optimize --no-dev && ls -la /app/vendor/autoload.php"
        replacement = "RUN composer dump-autoload --optimize --no-dev --no-scripts && ls -la /app/vendor/autoload.php"
        
        if target in content:
            new_content = content.replace(target, replacement)
            sftp = client.open_sftp()
            with sftp.file("/var/www/steman-alumni/Dockerfile", "w") as f:
                f.write(new_content)
            sftp.close()
            print("Successfully patched /var/www/steman-alumni/Dockerfile on the server!")
        else:
            print("Warning: Target string not found in Dockerfile or already patched.")
        
        # 2. Rebuilding the Docker app image
        print("--- Step 2: Rebuilding the Docker app image ---")
        cmd_build = "cd /var/www/steman-alumni && docker compose build --no-cache app"
        stdin, stdout, stderr = client.exec_command(cmd_build)
        
        # Read build output in chunks to show progress
        while not stdout.channel.exit_status_ready():
            if stdout.channel.recv_ready():
                print(stdout.channel.recv(2048).decode('utf-8', errors='replace'), end="")
            if stderr.channel.recv_ready():
                print(stderr.channel.recv(2048).decode('utf-8', errors='replace'), end="")
            time.sleep(0.5)
            
        status = stdout.channel.recv_exit_status()
        print(f"\nDocker Build finished with status: {status}\n")
        if status != 0:
            print("ERROR: Docker build failed!")
            client.close()
            return
            
        # 3. Restarting containers
        print("--- Step 3: Re-creating and starting steman-alumni containers ---")
        cmd_up = "cd /var/www/steman-alumni && docker compose up -d app queue reverb webserver"
        stdin, stdout, stderr = client.exec_command(cmd_up)
        print(stdout.read().decode('utf-8', errors='replace'))
        print(stderr.read().decode('utf-8', errors='replace'))
        
        # 4. Wait for steman_app container to be healthy
        print("--- Step 4: Waiting for steman_app container to become healthy ---")
        for i in range(12): # Wait up to 60 seconds
            stdin, stdout, stderr = client.exec_command("docker inspect -f '{{.State.Health.Status}}' steman_app")
            health_status = stdout.read().decode('utf-8', errors='replace').strip()
            print(f"[{i*5}s] Health status: {health_status}")
            if health_status == "healthy":
                print("steman_app is healthy!")
                break
            time.sleep(5)
            
        # 5. Running migrations
        print("\n--- Step 5: Running Laravel Database Migrations ---")
        cmd_migrate = "docker exec steman_app php artisan migrate --force"
        stdin, stdout, stderr = client.exec_command(cmd_migrate)
        print(stdout.read().decode('utf-8', errors='replace'))
        print(stderr.read().decode('utf-8', errors='replace'))
        
        # 6. Optimization/Cache clearing
        print("--- Step 6: Optimizing Laravel cache ---")
        cmd_optimize = (
            "docker exec steman_app php artisan optimize:clear && "
            "docker exec steman_app php artisan config:cache && "
            "docker exec steman_app php artisan route:cache && "
            "docker exec steman_app php artisan view:cache"
        )
        stdin, stdout, stderr = client.exec_command(cmd_optimize)
        print(stdout.read().decode('utf-8', errors='replace'))
        print(stderr.read().decode('utf-8', errors='replace'))
        
        # 7. Reload Nginx configuration to apply the Nginx fix
        print("--- Step 7: Reloading Nginx Configuration ---")
        cmd_nginx = "docker exec steman_nginx nginx -s reload"
        stdin, stdout, stderr = client.exec_command(cmd_nginx)
        print(stdout.read().decode('utf-8', errors='replace'))
        print(stderr.read().decode('utf-8', errors='replace'))
        
        print("\n=== DEPLOYMENT SUCCESSFULLY COMPLETED! ===")
        
        client.close()
    except Exception as e:
        print(f"Error during deployment: {e}")

if __name__ == "__main__":
    run_deployment()
