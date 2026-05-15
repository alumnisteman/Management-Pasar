import paramiko

def check_server_status():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to server.")
        
        # Check build.log
        stdin, stdout, stderr = client.exec_command("tail -n 20 /var/www/svms/apps/web/build.log")
        print("--- build.log tail ---")
        print(stdout.read().decode())
        print(stderr.read().decode())
        
        # Check current processes
        stdin, stdout, stderr = client.exec_command("ps aux | grep npm")
        print("--- Running npm processes ---")
        print(stdout.read().decode())
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_server_status()
