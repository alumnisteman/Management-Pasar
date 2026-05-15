import paramiko

def test_redis():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        # Just check if redis is reachable
        cmd = "docker exec svms-app-1 php -r \"$redis = new Redis(); if ($redis->connect('redis', 6379)) { echo 'CONNECTED'; } else { echo 'FAILED'; }\""
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode().strip())
    finally:
        client.close()

if __name__ == "__main__":
    test_redis()
