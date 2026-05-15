import paramiko
import sys

def upload_file(host, user, password, local_path, remote_path):
    try:
        transport = paramiko.Transport((host, 22))
        transport.connect(username=user, password=password)
        sftp = paramiko.SFTPClient.from_transport(transport)
        sftp.put(local_path, remote_path)
        sftp.close()
        transport.close()
        print(f"Uploaded {local_path} to {remote_path} successfully.")
    except Exception as e:
        print(f"SFTP Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 6:
        print("Usage: python sftp_upload.py <host> <user> <password> <local_path> <remote_path>")
        sys.exit(1)
        
    upload_file(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
