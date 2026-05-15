import paramiko
import sys

host = '103.175.219.57'
user = 'root'
password = 'M4ruw4h3@'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    print(f"Connecting to {host}...")
    client.connect(host, username=user, password=password)
    print("Connected successfully.")
    
    # 1. Let's see what images currently exist
    print("\n--- Current Docker Images ---")
    stdin, stdout, stderr = client.exec_command('docker images')
    print(stdout.read().decode())
    
    # 2. Prune unused images
    # -a removes all unused images, not just dangling ones
    # -f forces without prompt
    print("\n--- Cleaning up unused images (docker image prune -a -f) ---")
    stdin, stdout, stderr = client.exec_command('docker image prune -a -f')
    
    # Read the output line by line as it can take some time
    for line in iter(stdout.readline, ""):
        print(line, end="")
        
    error = stderr.read().decode()
    if error:
        print(f"Errors: {error}")
    
    print("\n--- Remaining Docker Images ---")
    stdin, stdout, stderr = client.exec_command('docker images')
    print(stdout.read().decode())
    
    print("\nCleanup complete.")
    
except Exception as e:
    print(f"Error: {e}")
finally:
    client.close()
