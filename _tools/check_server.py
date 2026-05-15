import paramiko

def check_server():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to " + host)
        
        stdin, stdout, stderr = client.exec_command("ls -la /var/www")
        print("\nContents of /var/www:")
        print(stdout.read().decode())
        
        stdin, stdout, stderr = client.exec_command("ls -la /")
        print("\nContents of /:")
        print(stdout.read().decode())

        stdin, stdout, stderr = client.exec_command("ls -la /root")
        print("\nContents of /root:")
        print(stdout.read().decode())
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_server()
