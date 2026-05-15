import paramiko

def check_server_webserver():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        stdin, stdout, stderr = client.exec_command("ps aux | grep -E 'nginx|apache|httpd'")
        print("Web server processes:")
        print(stdout.read().decode())
        
        stdin, stdout, stderr = client.exec_command("ls /etc/apache2/sites-enabled")
        print("Apache sites-enabled:")
        print(stdout.read().decode())
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_server_webserver()
