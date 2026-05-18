import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def rebuild():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=user, password=password)
    
    print("=== Step 1: Force pull latest from GitHub ===")
    stdin, stdout, stderr = client.exec_command("cd /var/www/svms/backend && git fetch origin master && git reset --hard origin/master && echo DONE")
    stdout.channel.set_combine_stderr(True)
    print(stdout.read().decode('utf-8', errors='replace'))
    
    print("\n=== Step 2: Verify new route file is present ===")
    stdin, stdout, stderr = client.exec_command("ls /var/www/svms/backend/apps/web/src/app/api/admin/stall-map/")
    print(stdout.read().decode('utf-8', errors='replace'))
    
    print("\n=== Step 3: Force rebuild Docker image (NO CACHE) ===")
    stdin, stdout, stderr = client.exec_command(
        "docker build --no-cache -t svms-dashboard:latest /var/www/svms/backend/apps/web 2>&1",
        timeout=600
    )
    stdout.channel.set_combine_stderr(True)
    # Stream output
    while True:
        line = stdout.readline()
        if not line:
            break
        print(line, end='', flush=True)
    
    print("\n=== Step 4: Recreate frontend container ===")
    stdin, stdout, stderr = client.exec_command("cd /var/www/svms && docker compose up -d --force-recreate frontend 2>&1")
    stdout.channel.set_combine_stderr(True)
    print(stdout.read().decode('utf-8', errors='replace'))
    
    print("\n=== Step 5: Wait 5s then test the system-guard route ===")
    import time
    time.sleep(5)
    stdin, stdout, stderr = client.exec_command("curl -s http://localhost:8001/api/admin/system-guard 2>&1 | head -c 200")
    result = stdout.read().decode('utf-8', errors='replace')
    if result.startswith('[') or result.startswith('{'):
        print("SUCCESS! Got JSON response:")
    else:
        print("STILL HTML or DOWN - something wrong:")
    print(result)
    
    client.close()

if __name__ == "__main__":
    rebuild()
