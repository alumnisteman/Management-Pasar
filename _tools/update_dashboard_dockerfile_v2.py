import paramiko

def update_dashboard_dockerfile_v2():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to server.")
        
        dockerfile_content = """
# Stage 1: Build
FROM node:20-alpine AS build
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
        
        print("Dashboard Dockerfile updated to Node 20.")
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_dashboard_dockerfile_v2()
