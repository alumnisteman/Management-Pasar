import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def find_request_string():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        # Search for any occurrence of 'request' or "request" inside app/ and config/ and bootstrap/
        # which is used with app() or make() or resolve() or similar
        print("=== Searching for request resolving patterns in PHP files ===")
        cmd = (
            "cd /var/www/steman-alumni && "
            "find app config bootstrap -name '*.php' -exec grep -Hn -i 'request' {} \\; | grep -E \"app\\(|make\\(|resolve\\(|\\['request'\\]|\\[\\\"request\\\"\\]\" || true"
        )
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode('utf-8')[:3000])
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_request_string()
