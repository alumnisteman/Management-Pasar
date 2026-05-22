import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

def run_cmd(cmd):
    print(f"\n=== Running: {cmd} ===")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out:
        print("STDOUT:")
        print(out[:4000])
    if err:
        print("STDERR:")
        print(err[:2000])
    return out

print("--- Testing Curl Response of SVMS Nginx (Port 8001) ---")
run_cmd("curl -sI http://localhost:8001")
run_cmd("curl -s http://localhost:8001 | head -n 30")

print("\n--- Testing Curl Response of SVMS Nginx (Port 8002) ---")
run_cmd("curl -sI http://localhost:8002")

print("\n--- Testing Curl Response of NewsHybrid Frontend (Port 8090) ---")
run_cmd("curl -sI http://localhost:8090")
run_cmd("curl -s http://localhost:8090 | head -n 30")

print("\n--- Testing Curl Response of NewsHybrid via SVMS Nginx (Port 8003) ---")
run_cmd("curl -sI http://localhost:8003")

print("\n--- Checking smos.conf in Nginx ---")
run_cmd("cat /etc/nginx/conf.d/smos.conf")

ssh.close()
