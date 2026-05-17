import paramiko
import json

def fix_package_json(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=user, password=password)
    
    path = "/var/www/svms/backend/apps/web/package.json"
    stdin, stdout, stderr = client.exec_command(f"cat {path}")
    content = stdout.read().decode('utf-8')
    p = json.loads(content)
    
    if "@react-router/dev" in p.get("devDependencies", {}):
        p["dependencies"]["@react-router/dev"] = p["devDependencies"].pop("@react-router/dev")
        
        sftp = client.open_sftp()
        with sftp.file(path, "w") as f:
            json.dump(p, f, indent=2)
        sftp.close()
        print("Updated package.json")
    else:
        print("@react-router/dev already moved or not found")

    # Now rebuild the image
    print("Rebuilding image...")
    # We need to rebuild the svms-dashboard image because the container uses the image, not the volume.
    # The Dockerfile copies package.json and runs npm install.
    stdin, stdout, stderr = client.exec_command("cd /var/www/svms/backend/apps/web && docker build -t svms-dashboard:latest .")
    for line in stdout:
        print(line.strip())
    
    # Revert the command in docker-compose.yml to the original one
    stdin, stdout, stderr = client.exec_command("cat /var/www/svms/docker-compose.yml")
    compose_content = stdout.read().decode('utf-8')
    new_compose = compose_content.replace(
        'command: ["sh", "-c", "npm install @react-router/dev --legacy-peer-deps && node build/server/index.js"]',
        'command:\n    - node\n    - build/server/index.js'
    )
    
    sftp = client.open_sftp()
    with sftp.file("/var/www/svms/docker-compose.yml", "w") as f:
        f.write(new_compose)
    sftp.close()
    
    # Restart
    print("Restarting containers...")
    client.exec_command("cd /var/www/svms && docker compose up -d --force-recreate")
    
    client.close()

if __name__ == "__main__":
    fix_package_json("103.175.219.57", "root", "M4ruw4h3@")
