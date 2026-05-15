import paramiko

def check_server_nginx():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        stdin, stdout, stderr = client.exec_command("ls /etc/nginx/sites-enabled")
        print("Nginx sites-enabled:")
        print(stdout.read().decode())
        
        stdin, stdout, stderr = client.exec_command("cat /etc/nginx/sites-enabled/default")
        print("Default Nginx config:")
        print(stdout.read().decode())
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_server_nginx()
