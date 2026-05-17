import paramiko

def main():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        # Run with tracing flags
        command = 'docker run --rm -e PORT=4000 -e BACKEND_URL=http://app:8000 svms-dashboard:latest node --trace-uncaught --trace-warnings --unhandled-rejections=strict build/server/index.js'
        
        print(f"Running command: {command}")
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
