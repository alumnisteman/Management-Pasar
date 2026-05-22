import paramiko
import os
import sys

def upload_dir(sftp, local_dir, remote_dir):
    try:
        sftp.mkdir(remote_dir)
    except IOError:
        pass # Directory probably exists

    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        remote_path = remote_dir + "/" + item

        if os.path.isfile(local_path):
            sftp.put(local_path, remote_path)
        elif os.path.isdir(local_path):
            upload_dir(sftp, local_path, remote_path)

if __name__ == "__main__":
    hostname = "103.175.219.57"
    username = "root"
    password = "M4ruw4h3@"

    print("Connecting to SSH...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        ssh.connect(hostname, username=username, password=password)
        print("Connected! Opening SFTP session...")
        sftp = ssh.open_sftp()
        
        local_project = r"D:\MP\news-hybrid"
        remote_project = "/root/news-hybrid"
        
        print(f"Uploading files from {local_project} to {remote_project}...")
        upload_dir(sftp, local_project, remote_project)
        print("Upload complete!")
        sftp.close()
        
        print("Executing deployment script...")
        stdin, stdout, stderr = ssh.exec_command(f"cd {remote_project} && chmod +x deploy.sh && dos2unix deploy.sh && ./deploy.sh")
        
        # Stream the output
        for line in iter(stdout.readline, ""):
            print(line, end="")
            
        err = stderr.read().decode()
        if err:
            print("STDERR:", err)
            
        ssh.close()
        print("Deployment finished successfully.")
    except Exception as e:
        print("Deployment failed:", e)
        sys.exit(1)
