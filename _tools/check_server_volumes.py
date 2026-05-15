import paramiko

def check_server_volumes():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        stdin, stdout, stderr = client.exec_command("docker inspect svms-app")
        print("svms-app inspect (Mounts):")
        import json
        data = json.loads(stdout.read().decode())
        if data:
            print(json.dumps(data[0].get("Mounts", []), indent=2))
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_server_volumes()
