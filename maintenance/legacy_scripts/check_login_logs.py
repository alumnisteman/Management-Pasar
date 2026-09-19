import paramiko

def check_login_logs():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        stdin, stdout, stderr = client.exec_command('docker exec svms-app-1 grep "Login attempt" storage/logs/laravel.log | tail -n 5')
        print("Login Logs:", stdout.read().decode())
    finally:
        client.close()

if __name__ == "__main__":
    check_login_logs()
