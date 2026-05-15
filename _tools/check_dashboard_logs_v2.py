import paramiko

def check_dashboard_logs_v2():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        stdin, stdout, stderr = client.exec_command("docker logs --tail 20 svms-dashboard-1")
        print("Dashboard container logs:")
        print(stdout.read().decode())
        print(stderr.read().decode())
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_dashboard_logs_v2()
