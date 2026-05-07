import paramiko
import base64
import sys

def upload_landing_page(host, user, password, local_file, remote_path):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        with open(local_file, 'rb') as f:
            content = f.read()
            encoded = base64.b64encode(content).decode('utf-8')
        
        # We use a temporary file to avoid issues with large strings in shell commands
        command = f"echo '{encoded}' | base64 -d > {remote_path}"
        stdin, stdout, stderr = client.exec_command(command)
        err = stderr.read().decode('utf-8')
        if err:
            print(f"Error: {err}")
        else:
            print(f"Successfully uploaded {local_file} to {remote_path}")
            
    except Exception as e:
        print(f"Exception: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    upload_landing_page("103.175.219.57", "root", "M4ruw4h3@", "index.html", "/var/www/svms/backend/resources/views/welcome.blade.php")
