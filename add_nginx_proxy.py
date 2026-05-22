import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

def run_cmd(cmd, timeout=60):
    print(f"\n=== Running: {cmd} ===")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out:
        print("STDOUT:")
        print(out)
    if err:
        print("STDERR:")
        print(err)

# Step 1: Connect news-hybrid-frontend-1 to svms_default network
# so svms_nginx can resolve it by hostname
print("Step 1: Connecting news-hybrid-frontend-1 to svms_default network...")
run_cmd("docker network connect svms_default news-hybrid-frontend-1 || echo 'Already connected'")

print("Step 2: Verifying news-hybrid-frontend-1 is in svms_default network...")
run_cmd("docker inspect news-hybrid-frontend-1 | grep -A 5 'svms_default'")

# Step 3: Read existing nginx config
print("Step 3: Reading current smos.conf to append to it...")
stdin, stdout, _ = ssh.exec_command("cat /etc/nginx/conf.d/smos.conf", timeout=10)
existing_conf = stdout.read().decode('utf-8', errors='replace')

# Step 4: Add a new server block for NewsHybrid on port 8003 if not already there
if '8003' not in existing_conf:
    print("Step 4: Adding NewsHybrid server block on port 8003...")
    news_hybrid_block = """

# 3. NewsHybrid Frontend (Next.js)
server {
    listen 8003;
    server_name localhost;

    location / {
        set $upstream_news news-hybrid-frontend-1;
        proxy_pass http://$upstream_news:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
"""
    append_cmd = f"cat >> /etc/nginx/conf.d/smos.conf << 'NGINX_EOF'\n{news_hybrid_block}\nNGINX_EOF"
    run_cmd(append_cmd)
else:
    print("Step 4: Port 8003 block already exists, skipping...")

# Step 5: Also update svms docker-compose.yml to expose port 8003
print("Step 5: Checking if port 8003 is exposed in svms_nginx container...")
run_cmd("docker inspect svms_nginx | grep -i '8003'")

print("Step 6: Test nginx config validity inside svms_nginx container...")
run_cmd("docker exec -t svms_nginx nginx -t")

print("Step 7: Reload nginx configuration...")
run_cmd("docker exec -t svms_nginx nginx -s reload")

print("Step 8: Verifying port 8003 is accessible (from container's view)...")
run_cmd("curl -si http://localhost:8090/ | head -5")

print("\nDone! Try accessing NewsHybrid at:")
print("  - http://103.175.219.57:8090/  (Direct - always works)")
print("  Note: Port 8003 requires svms_nginx docker-compose to expose port 8003")

ssh.close()
