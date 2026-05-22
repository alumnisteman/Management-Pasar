import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

stdin, stdout, stderr = ssh.exec_command('curl -s http://localhost:8001')
html = stdout.read()
ssh.close()

with open('D:/MP/remote_response.html', 'wb') as f:
    f.write(html)

print("Saved HTML response to D:/MP/remote_response.html")
