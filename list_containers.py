import paramiko

def list_containers():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        stdin, stdout, stderr = client.exec_command('docker ps --format "{{.Names}}"')
        print(stdout.read().decode())
    finally:
        client.close()

if __name__ == "__main__":
    list_containers()
