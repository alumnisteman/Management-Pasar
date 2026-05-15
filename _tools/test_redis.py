import paramiko

def test_redis():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        # Test redis connectivity via tinker
        cmd = "docker exec svms-app-1 php artisan tinker --execute=\"try { Cache::store('redis')->put('test_key', 'test_value', 60); echo 'Redis Connection: OK'; } catch (\Exception $e) { echo 'Redis Connection: FAIL - ' . $e->getMessage(); }\""
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode().strip())
    finally:
        client.close()

if __name__ == "__main__":
    test_redis()
