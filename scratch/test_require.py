import paramiko

def test_require(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=user, password=password)
    
    print("Testing require('@react-router/dev')...")
    stdin, stdout, stderr = client.exec_command(
        'docker run --rm svms-dashboard:latest node -e "console.log(\'Starting...\'); try { require(\'@react-router/dev\'); console.log(\'Success!\'); } catch (e) { console.error(e); }"'
    )
    print("STDOUT:")
    print(stdout.read().decode('utf-8'))
    print("STDERR:")
    print(stderr.read().decode('utf-8'))
    
    client.close()

if __name__ == "__main__":
    test_require("103.175.219.57", "root", "M4ruw4h3@")
