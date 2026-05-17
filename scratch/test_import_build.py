import paramiko

def main():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        # Test direct import of server-build.js and keep event loop alive for 5 seconds
        command = 'docker run --rm svms-dashboard:latest node -e "import(\'./build/server/assets/server-build.js\').then(x => { console.log(\'Loaded successfully\'); process.exit(0); }).catch(err => { console.error(\'Error:\', err); process.exit(1); }); setTimeout(() => {}, 5000);"'
        
        print(f"Running: {command}")
        stdin, stdout, stderr = client.exec_command(command)
        print("--- STDOUT ---")
        print(stdout.read().decode('utf-8'))
        print("--- STDERR ---")
        print(stderr.read().decode('utf-8'))
        print(f"--- EXIT CODE: {stdout.channel.recv_exit_status()} ---")
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
