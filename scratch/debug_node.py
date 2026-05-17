import paramiko

def debug_node(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=user, password=password)
    
    print("Running node index.js directly...")
    stdin, stdout, stderr = client.exec_command(
        'docker run --rm -e NODE_OPTIONS="--trace-uncaught" svms-dashboard:latest node build/server/index.js'
    )
    print("STDOUT:")
    print(stdout.read().decode('utf-8'))
    print("STDERR:")
    print(stderr.read().decode('utf-8'))
    
    # Try running the entrypoint directly and dumping any unhandled rejections
    print("Running with unhandled rejection trace...")
    stdin, stdout, stderr = client.exec_command(
        'docker run --rm svms-dashboard:latest node -e "process.on(\'unhandledRejection\', console.error); import(\'./build/server/index.js\').catch(console.error)"'
    )
    print("STDOUT:")
    print(stdout.read().decode('utf-8'))
    print("STDERR:")
    print(stderr.read().decode('utf-8'))
    
    client.close()

if __name__ == "__main__":
    debug_node("103.175.219.57", "root", "M4ruw4h3@")
