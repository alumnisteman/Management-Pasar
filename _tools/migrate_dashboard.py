import paramiko

def migrate_dashboard_source():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to server.")
        
        # 1. Clear old dashboard
        client.exec_command("rm -rf /var/www/svms/dashboard/*")
        
        # 2. Copy from apps/web to dashboard
        client.exec_command("cp -r /var/www/svms/apps/web/* /var/www/svms/dashboard/")
        
        # Ensure SPA mode (ssr: false)
        client.exec_command("sed -i 's/ssr: true/ssr: false/' /var/www/svms/dashboard/react-router.config.ts")
        client.exec_command("sed -i '/prerender:/d' /var/www/svms/dashboard/react-router.config.ts")
        
        # 3. Create a NEW Dockerfile for dashboard
        dockerfile_content = """
# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
# Add build script if missing
RUN if ! grep -q "build" package.json; then sed -i 's/"scripts": {/"scripts": {\\n    "build": "react-router build",/' package.json; fi
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/build/client /usr/share/nginx/html
# React Router SPA config for Nginx
RUN printf 'server {\\n    listen 80;\\n    location / {\\n        root /usr/share/nginx/html;\\n        index index.html;\\n        try_files $uri $uri/ /index.html;\\n    }\\n}' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
"""
        sftp = client.open_sftp()
        with sftp.file("/var/www/svms/dashboard/Dockerfile", "w") as f:
            f.write(dockerfile_content)
        sftp.close()
        
        print("Dashboard source migrated and Dockerfile updated.")
        
        # 4. Rebuild the dashboard container
        print("Rebuilding dashboard container...")
        client.exec_command("cd /var/www/svms && docker-compose build dashboard && docker-compose up -d dashboard")
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    migrate_dashboard_source()
