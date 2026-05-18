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
    
    print("=== Test 1: Laravel API from inside frontend container ===")
    stdin, stdout, stderr = client.exec_command("docker exec svms-frontend-1 wget -qO- http://app:8000/api/admin/stall-map/data 2>&1 | head -c 500")
    print(stdout.read().decode('utf-8', errors='replace'))
    print(stderr.read().decode('utf-8', errors='replace'))
    
    print("\n=== Test 2: Laravel API direct from host ===")
    stdin, stdout, stderr = client.exec_command("curl -s http://localhost:8002/api/admin/stall-map/data 2>&1 | head -c 500")
    print(stdout.read().decode('utf-8', errors='replace'))
    print(stderr.read().decode('utf-8', errors='replace'))
    
    print("\n=== Test 3: Frontend stall-map endpoint from outside ===")
    stdin, stdout, stderr = client.exec_command("curl -s http://localhost:8001/api/admin/stall-map/data 2>&1 | head -c 500")
    print(stdout.read().decode('utf-8', errors='replace'))
    print(stderr.read().decode('utf-8', errors='replace'))
    
    print("\n=== Test 4: svms-frontend-1 env vars ===")
    stdin, stdout, stderr = client.exec_command("docker exec svms-frontend-1 env | grep -E 'BACKEND|PORT'")
    print(stdout.read().decode('utf-8', errors='replace'))
    
    print("\n=== Test 5: Frontend container can reach app:8000? ===")
    stdin, stdout, stderr = client.exec_command("docker exec svms-frontend-1 wget -qO- http://app:8000/api/ping 2>&1")
    print(stdout.read().decode('utf-8', errors='replace'))
    print(stderr.read().decode('utf-8', errors='replace'))
    
    print("\n=== Test 6: Laravel GridController.php getMapData - check if method exists ===")
    stdin, stdout, stderr = client.exec_command("docker exec svms-app-1 php artisan route:list --path=admin/stall-map 2>&1")
    print(stdout.read().decode('utf-8', errors='replace'))
    
    client.close()

if __name__ == "__main__":
    diagnose()
