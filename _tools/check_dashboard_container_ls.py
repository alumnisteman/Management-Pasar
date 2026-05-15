import paramiko

def check_dashboard_container_ls():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        stdin, stdout, stderr = client.exec_command("docker exec svms-dashboard-1 ls -la /usr/share/nginx/html")
        print("Dashboard container files:")
        print(stdout.read().decode())
        print(stderr.read().decode())
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_dashboard_container_ls()
