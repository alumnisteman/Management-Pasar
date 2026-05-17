import paramiko
import time

def main():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        # Run node build_from_container/server/index.js inside the container
        # Since it runs a server, it will stay active. We read output for 5 seconds and then stop.
        command = 'docker run --name temp-dashboard -d -p 4000:4000 -e PORT=4000 -e BACKEND_URL=http://app:8000 svms-dashboard:latest node build_from_container/server/index.js'
        
        print("Starting temporary dashboard container...")
        client.exec_command(command)
        
        time.sleep(3)
        
        print("Checking logs of temporary container...")
        stdin, stdout, stderr = client.exec_command('docker logs temp-dashboard')
        out_logs = stdout.read().decode('utf-8')
        err_logs = stderr.read().decode('utf-8')
        
        print("--- STDOUT ---")
        print(out_logs)
        print("--- STDERR ---")
        print(err_logs)
        
        print("Stopping and removing temporary container...")
        client.exec_command('docker stop temp-dashboard && docker rm temp-dashboard')
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
