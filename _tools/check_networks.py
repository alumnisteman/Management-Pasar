import paramiko

def check_networks():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        # Check Meili network
        cmd1 = "docker inspect steman_meilisearch --format='{{range $net,$v := .NetworkSettings.Networks}}{{println $net}}{{end}}'"
        stdin, stdout, stderr = client.exec_command(cmd1)
        print("Meili Networks:", stdout.read().decode().strip())
        
        # Check App network
        cmd2 = "docker inspect svms-app-1 --format='{{range $net,$v := .NetworkSettings.Networks}}{{println $net}}{{end}}'"
        stdin, stdout, stderr = client.exec_command(cmd2)
        print("App Networks:", stdout.read().decode().strip())
    finally:
        client.close()

if __name__ == "__main__":
    check_networks()
