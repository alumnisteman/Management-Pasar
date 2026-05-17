import paramiko

def main():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        # Test command
        command = 'docker run --rm -e PORT=4000 -e BACKEND_URL=http://app:8000 svms-dashboard:latest node --trace-warnings -e "import(\'./build/server/index.js\').then(x => console.log(\'Loaded successfully\')).catch(err => console.error(\'Load error:\', err))"'
        
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
