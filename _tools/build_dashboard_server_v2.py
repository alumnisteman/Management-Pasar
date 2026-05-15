import paramiko
import os

def build_dashboard_server_v2():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    log_file = r"d:\MP\server_build.log"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to server.")
        
        with open(log_file, "w", encoding="utf-8") as log:
            # Build dashboard
            print("Starting build...")
            stdin, stdout, stderr = client.exec_command("cd /var/www/svms && /usr/bin/docker compose build --no-cache dashboard")
            
            import time
            while not stdout.channel.exit_status_ready():
                if stdout.channel.recv_ready():
                    chunk = stdout.channel.recv(1024).decode('utf-8', errors='replace')
                    log.write(chunk)
                    log.flush()
                if stderr.channel.recv_ready():
                    chunk = stderr.channel.recv(1024).decode('utf-8', errors='replace')
                    log.write(chunk)
                    log.flush()
                time.sleep(1)
                
            status = stdout.channel.recv_exit_status()
            print("Build finished with exit status:", status)
            log.write(f"\nBuild finished with exit status: {status}\n")
            
            if status == 0:
                # Up dashboard
                print("Starting container...")
                stdin, stdout, stderr = client.exec_command("cd /var/www/svms && /usr/bin/docker compose up -d dashboard")
                out = stdout.read().decode('utf-8', errors='replace')
                err = stderr.read().decode('utf-8', errors='replace')
                print(out)
                print(err)
                log.write(out)
                log.write(err)
            
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    build_dashboard_server_v2()
