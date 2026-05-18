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
    
    print("=== 1. What's in build/server/index.js? (grep for stall-map) ===")
    stdin, stdout, stderr = client.exec_command("docker exec svms-frontend-1 grep -n 'stall-map\\|stall_map\\|stallMap\\|getMapData' /app/build/server/index.js | head -20")
    print(stdout.read().decode('utf-8', errors='replace'))
    
    print("\n=== 2. What's in build/server/index.js? (grep for /api/admin) ===")
    stdin, stdout, stderr = client.exec_command("docker exec svms-frontend-1 grep -n '\\/api\\/admin' /app/build/server/index.js | head -20")
    print(stdout.read().decode('utf-8', errors='replace'))
    
    print("\n=== 3. Check route-builder in server build ===")
    stdin, stdout, stderr = client.exec_command("docker exec svms-frontend-1 grep -n 'registerRoutes\\|routeModules\\|API_BASENAME' /app/build/server/index.js | head -20")
    print(stdout.read().decode('utf-8', errors='replace'))
    
    print("\n=== 4. Size of the server build ===")
    stdin, stdout, stderr = client.exec_command("docker exec svms-frontend-1 ls -lah /app/build/server/index.js")
    print(stdout.read().decode('utf-8', errors='replace'))
    
    print("\n=== 5. List all files inside the container's /app ===")
    stdin, stdout, stderr = client.exec_command("docker exec svms-frontend-1 ls /app/")
    print(stdout.read().decode('utf-8', errors='replace'))
    
    print("\n=== 6. Check if there is a src/app/api folder in container ===")
    stdin, stdout, stderr = client.exec_command("docker exec svms-frontend-1 ls /app/src/app/api/admin/ 2>&1")
    print(stdout.read().decode('utf-8', errors='replace'))
    
    print("\n=== 7. Full server index.js first 100 lines - check route registration ===")
    stdin, stdout, stderr = client.exec_command("docker exec svms-frontend-1 head -n 100 /app/build/server/index.js")
    print(stdout.read().decode('utf-8', errors='replace'))
    
    client.close()

if __name__ == "__main__":
    diagnose()
