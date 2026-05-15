import paramiko

def check_build_log_tail():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        stdin, stdout, stderr = client.exec_command("tail -n 20 /var/www/svms/apps/web/build.log")
        print("Build log tail:")
        # Use errors='replace' to avoid encoding issues
        print(stdout.read().decode('utf-8', errors='replace'))
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_build_log_tail()
