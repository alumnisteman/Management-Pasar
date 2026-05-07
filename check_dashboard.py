import paramiko

def check_dashboard():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        stdin, stdout, stderr = client.exec_command('docker exec svms-dashboard-1 grep "login-email" /usr/share/nginx/html/index.html')
        print("Found:", stdout.read().decode())
    finally:
        client.close()

if __name__ == "__main__":
    check_dashboard()
