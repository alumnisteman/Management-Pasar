import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

def run_cmd(cmd):
    print(f"--- Running: {cmd} ---")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out:
        print("STDOUT:")
        print(out)
    if err:
        print("STDERR:")
        print(err)

run_cmd("curl -i http://localhost:8085/api/news")
run_cmd("docker exec -t news-hybrid-app-1 php artisan db:show || docker exec -t news-hybrid-app-1 php artisan migrate:status")
run_cmd("docker exec -t news-hybrid-mysql-1 mysql -uroot -proot -e 'use news_hybrid; select count(*) from news;'")

ssh.close()
