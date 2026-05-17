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
        print("Connected to server.")
        
        # Run worker command manually and capture its error trace
        command = "docker exec svms-worker-1 php artisan queue:work --tries=1"
        print(f"Running: {command}")
        stdin, stdout, stderr = client.exec_command(command)
        
        # Wait up to 5 seconds for the error to occur
        time.sleep(5)
        
        print("--- STDOUT ---")
        print(stdout.read().decode('utf-8'))
        print("--- STDERR ---")
        print(stderr.read().decode('utf-8'))
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
