import paramiko
import base64

def deploy_mobile(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        print("Uploading main.dart...")
        with open("main.dart", 'rb') as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
        
        remote_path = "/var/www/svms/mobile/lib/main.dart"
        client.exec_command(f"echo '{encoded}' | base64 -d > {remote_path}")
        print("Mobile source synced.")
    finally:
        client.close()

if __name__ == "__main__":
    deploy_mobile("103.175.219.57", "root", "M4ruw4h3@")
