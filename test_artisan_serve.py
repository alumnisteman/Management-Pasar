import paramiko
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

def run_cmd(cmd):
    print(f"=== Running: {cmd} ===")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out:
        print("STDOUT:")
        print(out)
    if err:
        print("STDERR:")
        print(err)

print("Step 1: Check if anything is running on port 8000 inside the container...")
run_cmd("docker exec -t news-hybrid-app-1 ss -tlnp")

print("Step 2: Try running php artisan serve inside the container in the background...")
# We use nohup or run in background
ssh.exec_command("docker exec -d news-hybrid-app-1 php artisan serve --host=0.0.0.0 --port=8000")
time.sleep(3)

print("Step 3: Check listening ports inside the container again...")
run_cmd("docker exec -t news-hybrid-app-1 ss -tlnp")

print("Step 4: Check if host port 8085 responds now...")
run_cmd("curl -i http://localhost:8085/api/news")

ssh.close()
