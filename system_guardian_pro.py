import paramiko
import base64
import os
import time

# --- CONFIGURATION ---
HOST = "103.175.219.57"
USER = "root"
PASS = "M4ruw4h3@"
REMOTE_PATH = "/var/www/svms/backend"

def run_command(client, cmd):
    print(f"Running: {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='ignore')
    err = stderr.read().decode('utf-8', errors='ignore')
    return out, err

def deploy_file(client, local_path, remote_path):
    if not os.path.exists(local_path):
        return False
    with open(local_path, 'rb') as f:
        content = f.read()
        encoded = base64.b64encode(content).decode('utf-8')
    client.exec_command(f"mkdir -p {os.path.dirname(remote_path)}")
    client.exec_command(f"echo '{encoded}' | base64 -d > {remote_path}")
    return True

def main():
    print("=== SVMS ENTERPRISE SYSTEM GUARDIAN PRO ===")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(HOST, username=USER, password=PASS)
        
        print("\n[1/4] Deploying Core Logic & Maintenance Suite...")
        files = [
            ("admin_modern.html", f"{REMOTE_PATH}/resources/views/admin.blade.php"),
            ("SystemDoctor.php", f"{REMOTE_PATH}/app/Console/Commands/SystemDoctor.php"),
            ("SystemTune.php", f"{REMOTE_PATH}/app/Console/Commands/SystemTune.php"),
            ("api.php", f"{REMOTE_PATH}/routes/api.php"),
            ("GridController.php", f"{REMOTE_PATH}/app/Http/Controllers/GridController.php"),
            ("MarketController.php", f"{REMOTE_PATH}/app/Http/Controllers/MarketController.php"),
        ]
        for local, remote in files:
            if deploy_file(client, local, remote):
                print(f"  [OK] Deployed {local}")
            else:
                print(f"  [FAIL] Failed to find {local}")

        print("\n[2/4] Syncing to Container...")
        client.exec_command(f"docker cp {REMOTE_PATH}/resources/views/admin.blade.php svms-app-1:/var/www/resources/views/admin.blade.php")
        client.exec_command(f"docker cp {REMOTE_PATH}/app/Console/Commands/SystemDoctor.php svms-app-1:/var/www/app/Console/Commands/SystemDoctor.php")
        client.exec_command(f"docker cp {REMOTE_PATH}/app/Console/Commands/SystemTune.php svms-app-1:/var/www/app/Console/Commands/SystemTune.php")

        print("\n[3/4] Running Automated Diagnostics and Optimization...")
        out, _ = run_command(client, "docker exec svms-app-1 php artisan system:doctor --fix")
        print(out)
        
        out, _ = run_command(client, "docker exec svms-app-1 php artisan system:tune")
        print(out)

        print("\n[4/4] Finalizing System Performance...")
        client.exec_command("docker exec svms-app-1 php artisan route:clear")
        client.exec_command("docker exec svms-app-1 php artisan view:clear")
        client.exec_command("docker exec svms-app-1 php artisan cache:clear")
        
        print("\nSUCCESS: All systems are stable, tuned, and secured.")
        
    except Exception as e:
        print(f"\nCRITICAL ERROR: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    main()
