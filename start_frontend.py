import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

print("Starting Next.js...")
stdin, stdout, stderr = ssh.exec_command('cd /root/news-hybrid/frontend && nohup npm run dev -- -p 3000 > next.log 2>&1 &')
ssh.close()
print("Done")
