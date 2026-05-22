import paramiko
import io
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

docker_compose_content = """services:
  app:
    build: 
      context: .
      dockerfile: docker/app.Dockerfile
    command: php artisan serve --host=0.0.0.0 --port=8000
    ports:
      - "8085:8000"
    volumes:
      - ./app-backend:/var/www/html
    depends_on:
      - mysql
      - redis

  mysql:
    image: mysql:8
    ports:
      - "3307:3306"
    environment:
      MYSQL_DATABASE: news_hybrid
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  scraper:
    image: mcr.microsoft.com/playwright:v1.52.0
    volumes:
      - ./scraper:/scraper
    working_dir: /scraper
    command: tail -f /dev/null

  meilisearch:
    image: getmeili/meilisearch:v1.12
    ports:
      - "7700:7700"
    environment:
      - MEILI_MASTER_KEY=masterKey
    volumes:
      - meili_data:/meili_data

volumes:
  mysql_data:
  redis_data:
  meili_data:
"""

print("Step 1: Writing corrected docker-compose.yml to VPS...")
sftp = ssh.open_sftp()
sftp.putfo(io.BytesIO(docker_compose_content.encode('utf-8')), '/root/news-hybrid/docker-compose.yml')
sftp.close()

print("Step 2: Restarting docker compose...")
stdin, stdout, stderr = ssh.exec_command("cd /root/news-hybrid && docker compose down && docker compose up -d")
print("STDOUT:")
print(stdout.read().decode('utf-8', errors='replace'))
print("STDERR:")
print(stderr.read().decode('utf-8', errors='replace'))

print("Step 3: Waiting 10 seconds...")
time.sleep(10)

print("Step 4: Checking container status...")
stdin, stdout, stderr = ssh.exec_command("docker ps")
print(stdout.read().decode('utf-8', errors='replace'))

print("Step 5: Testing API response...")
stdin, stdout, stderr = ssh.exec_command("curl -i http://localhost:8085/api/news")
print(stdout.read().decode('utf-8', errors='replace'))

ssh.close()
print("Completed.")
