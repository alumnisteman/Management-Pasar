import paramiko

def tidy_mobile_server():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to server.")
        
        # 1. Backup old flutter mobile
        client.exec_command("mv /var/www/svms/mobile /var/www/svms/mobile_legacy_flutter")
        
        # 2. Move new expo mobile to its place
        client.exec_command("mv /var/www/svms/apps/mobile /var/www/svms/mobile")
        
        print("Mobile app tidied up on server.")
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    tidy_mobile_server()
