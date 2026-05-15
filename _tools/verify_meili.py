import paramiko

def verify_meili():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        cmd = "curl -s -H 'Authorization: Bearer stemanMasterKey123' http://localhost:7700/indexes"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
    finally:
        client.close()

if __name__ == "__main__":
    verify_meili()
