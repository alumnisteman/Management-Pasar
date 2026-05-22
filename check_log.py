import paramiko
import sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

# Check logs
stdin, stdout, stderr = ssh.exec_command('cat /root/news-hybrid/frontend/next.log 2>&1 | tail -40')
out = stdout.read().decode('utf-8', errors='replace')
sys.stdout.buffer.write(out.encode('utf-8'))
sys.stdout.buffer.flush()

ssh.close()
