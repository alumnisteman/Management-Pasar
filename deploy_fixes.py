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

print("Step 1: Modifying bootstrap/app.php to add api routing...")
# We will use sed to insert the api routing line in bootstrap/app.php
modify_app_php = """sed -i 's|web: __DIR__.\\x27/../routes/web.php\\x27,|web: __DIR__.\\x27/../routes/web.php\\x27,\\n        api: __DIR__.\\x27/../routes/api.php\\x27,|' /root/news-hybrid/app-backend/bootstrap/app.php"""
run_cmd(modify_app_php)

print("Step 2: Checking bootstrap/app.php content...")
run_cmd("cat /root/news-hybrid/app-backend/bootstrap/app.php")

print("Step 3: Modifying remote docker-compose.yml to run php artisan serve...")
# We want to add command: php artisan serve --host=0.0.0.0 --port=8000 under app: service
# In docker-compose.yml:
#   app:
#     build: 
#       context: .
#       dockerfile: docker/app.Dockerfile
#     ports:
#       - "8085:8000"
# We can insert command: php artisan serve --host=0.0.0.0 --port=8000 under ports: or build:
modify_docker_compose = """sed -i '/ports:/i \\    command: php artisan serve --host=0.0.0.0 --port=8000' /root/news-hybrid/docker-compose.yml"""
run_cmd(modify_docker_compose)

print("Step 4: Checking remote docker-compose.yml content...")
run_cmd("cat /root/news-hybrid/docker-compose.yml")

print("Step 5: Restarting Docker containers...")
run_cmd("cd /root/news-hybrid && docker compose down && docker compose up -d")

print("Step 6: Waiting 10 seconds for service start...")
time.sleep(10)

print("Step 7: Checking Laravel routes...")
run_cmd("docker exec -t news-hybrid-app-1 php artisan route:list")

print("Step 8: Testing API response...")
run_cmd("curl -i http://localhost:8085/api/news")

ssh.close()
print("Fixes deployed.")
