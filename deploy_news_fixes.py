import paramiko
import sys
import io

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
        print("STDOUT:", out[:2000])
    if err:
        print("STDERR:", err[:2000])
    return out

sftp = ssh.open_sftp()

# 1. Upload docker-compose.yml
with open(r'd:\MP\news-hybrid\docker-compose.yml', 'r', encoding='utf-8') as f:
    dc_content = f.read()
target_dc = '/root/news-hybrid/docker-compose.yml'
print(f"Uploading docker-compose.yml to {target_dc}...")
sftp.putfo(io.BytesIO(dc_content.encode('utf-8')), target_dc)

# 2. Upload scraper.js
with open(r'd:\MP\news-hybrid\scraper\scraper.js', 'r', encoding='utf-8') as f:
    scraper_content = f.read()
target_scraper = '/root/news-hybrid/scraper/scraper.js'
print(f"Uploading scraper.js to {target_scraper}...")
sftp.putfo(io.BytesIO(scraper_content.encode('utf-8')), target_scraper)

# 3. Upload ScrapeNewsJob.php to both locations
with open(r'd:\MP\news-hybrid\laravel-custom\ScrapeNewsJob.php', 'r', encoding='utf-8') as f:
    job_content = f.read()
target_job1 = '/root/news-hybrid/laravel-custom/ScrapeNewsJob.php'
target_job2 = '/root/news-hybrid/app-backend/app/Jobs/ScrapeNewsJob.php'
print(f"Uploading ScrapeNewsJob.php to {target_job1}...")
sftp.putfo(io.BytesIO(job_content.encode('utf-8')), target_job1)
print(f"Uploading ScrapeNewsJob.php to {target_job2}...")
sftp.putfo(io.BytesIO(job_content.encode('utf-8')), target_job2)

# 3b. Upload app.Dockerfile to remote
with open(r'd:\MP\news-hybrid\docker\app.Dockerfile', 'r', encoding='utf-8') as f:
    df_content = f.read()
target_df = '/root/news-hybrid/docker/app.Dockerfile'
print(f"Uploading app.Dockerfile to {target_df}...")
sftp.putfo(io.BytesIO(df_content.encode('utf-8')), target_df)

sftp.close()

# 4. Restart news-hybrid Docker Compose stack
print("Recreating Docker containers...")
run_cmd("cd /root/news-hybrid && docker compose down && docker compose up -d")

# 5. Wait a bit and check container status
import time
print("Waiting for containers to initialize...")
time.sleep(5)
run_cmd("docker ps | grep news-hybrid")

# 6. Install Playwright browsers inside news-hybrid-scraper-1
print("Installing Playwright browsers inside news-hybrid-scraper-1...")
run_cmd("docker exec news-hybrid-scraper-1 npx playwright install")

# 7. Check if there are any existing pending jobs
print("Checking active jobs inside the Laravel queue table...")
run_cmd("docker exec news-hybrid-app-1 php artisan queue:failed || true")
run_cmd("docker exec news-hybrid-app-1 php artisan tinker --execute=\"print_r(DB::table('jobs')->count());\"")

# 8. Let's clear any failed jobs and run RSS feed fetch to start fresh
print("Fetching RSS news articles to queue new scraping jobs...")
run_cmd("docker exec news-hybrid-app-1 php artisan news:fetch-rss")

ssh.close()
print("\nDeployment of News Hybrid fixes complete!")
