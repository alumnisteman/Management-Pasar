import paramiko

def test_docker_compose_simple():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        stdin, stdout, stderr = client.exec_command("/usr/bin/docker compose ps")
        print("Docker compose ps output:")
        print(stdout.read().decode())
        print(stderr.read().decode())
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_docker_compose_simple()
