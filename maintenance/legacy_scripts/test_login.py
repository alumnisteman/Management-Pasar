import paramiko

def test_login():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        # Test admin login
        cmd1 = 'docker exec svms-app-1 curl -s -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d \'{"email": "admin@svms.id", "password": "admin123"}\''
        stdin, stdout, stderr = client.exec_command(cmd1)
        print("Admin Response:", stdout.read().decode())
        
        # Test officer login
        cmd2 = 'docker exec svms-app-1 curl -s -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d \'{"email": "officer@svms.id", "password": "officer123"}\''
        stdin, stdout, stderr = client.exec_command(cmd2)
        print("Officer Response:", stdout.read().decode())
    finally:
        client.close()

if __name__ == "__main__":
    test_login()
