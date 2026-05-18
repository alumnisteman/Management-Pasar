import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def diagnose():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=user, password=password)
    
    print("=== Test: What built route files exist in frontend container? ===")
    stdin, stdout, stderr = client.exec_command("docker exec svms-frontend-1 find /app/build -name '*.js' | grep -E 'stall|api|admin' | head -20")
    print(stdout.read().decode('utf-8', errors='replace'))
    
    print("\n=== Test: List server routes from Hono build ===")
    stdin, stdout, stderr = client.exec_command("docker exec svms-frontend-1 ls /app/build/server/")
    print(stdout.read().decode('utf-8', errors='replace'))
    
    print("\n=== Test: Check full response header for /api/admin/stall-map/data ===")
    stdin, stdout, stderr = client.exec_command("curl -sv http://localhost:8001/api/admin/stall-map/data 2>&1 | head -c 1000")
    print(stdout.read().decode('utf-8', errors='replace'))
    print(stderr.read().decode('utf-8', errors='replace'))
    
    print("\n=== Test: Check if the new route file actually exists in container build ===")
    stdin, stdout, stderr = client.exec_command("docker exec svms-frontend-1 ls /app/src/app/api/admin/ 2>&1")
    print(stdout.read().decode('utf-8', errors='replace'))
    print(stderr.read().decode('utf-8', errors='replace'))
    
    client.close()

if __name__ == "__main__":
    diagnose()
