import paramiko

def find_auth_controllers():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        stdin, stdout, stderr = client.exec_command('docker exec svms-app-1 find /var/www -name "AuthController.php"')
        print("Found:", stdout.read().decode())
    finally:
        client.close()

if __name__ == "__main__":
    find_auth_controllers()
