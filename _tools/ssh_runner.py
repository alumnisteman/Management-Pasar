import paramiko
import sys

def run_ssh_command(host, user, password, command):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        stdin, stdout, stderr = client.exec_command(command)
        out = stdout.read().decode('utf-8')
        err = stderr.read().decode('utf-8')
        exit_status = stdout.channel.recv_exit_status()
        print(f"--- STDOUT ---\n{out}")
        print(f"--- STDERR ---\n{err}")
        print(f"--- EXIT CODE: {exit_status} ---")
    except Exception as e:
        print(f"SSH Exception: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        run_ssh_command("103.175.219.57", "root", "M4ruw4h3@", sys.argv[1])
