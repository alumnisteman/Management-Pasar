import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def find_request_resolves():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        # Search globally for "request" resolving from the container
        cmd = (
            "cd /var/www/steman-alumni && "
            "grep -rnw . --exclude-dir={vendor,storage,node_modules,public,tests} -e \"app('request')\" -e \"resolve('request')\" -e \"app\\[['\\\"]request['\\\"]\\]\" -e \"app->make('request')\" -e \"app\\(\\\"request\\\"\\)\" || true"
        )
        print("=== Searching globally for container request resolves ===")
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode('utf-8'))
        
        # Also let's check recent changes in app/Providers/ or config/
        print("=== Checking recent commits in app/Providers/ ===")
        stdin, stdout, stderr = client.exec_command("cd /var/www/steman-alumni && git log -p -n 5 -- app/Providers/")
        print(stdout.read().decode('utf-8')[:2000])
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_request_resolves()
