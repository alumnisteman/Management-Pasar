import paramiko
import base64

def deploy_dashboard(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        print("Uploading dashboard...")
        with open("dashboard_v55.html", 'rb') as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
        
        # Target index.html in the dashboard folder
        remote_path = "/var/www/svms/dashboard/index.html"
        client.exec_command(f"echo '{encoded}' | base64 -d > {remote_path}")
        print("Dashboard deployed.")
    finally:
        client.close()

if __name__ == "__main__":
    deploy_dashboard("103.175.219.57", "root", "M4ruw4h3@")
