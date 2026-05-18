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
        
        # Search for app('request'), resolve('request'), app['request'], etc.
        cmd = (
            "cd /var/www/steman-alumni && "
            "grep -rnw app/ -e \"app('request')\" -e \"resolve('request')\" -e \"app\\[['\\\"]request['\\\"]\\]\" -e \"app->make('request')\" || true"
        )
        print("=== Searching for request resolving in app/ ===")
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode('utf-8'))
        
        cmd_providers = (
            "cd /var/www/steman-alumni && "
            "grep -rnw app/Providers/ -e \"request\" || true"
        )
        print("=== Searching for 'request' in app/Providers/ ===")
        stdin, stdout, stderr = client.exec_command(cmd_providers)
        print(stdout.read().decode('utf-8')[:2000]) # limit output
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_request_resolves()
