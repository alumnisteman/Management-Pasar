import paramiko
import sys

def run_ssh_command(host, user, password, command):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        stdin, stdout, stderr = client.exec_command(command)
        out = stdout.read().decode('utf-8', errors='replace')
        err = stderr.read().decode('utf-8', errors='replace')
        exit_status = stdout.channel.recv_exit_status()
        with open('ssh_output.txt', 'w', encoding='utf-8') as f:
            f.write(f"--- STDOUT ---\n{out}\n")
            f.write(f"--- STDERR ---\n{err}\n")
            f.write(f"--- EXIT CODE: {exit_status} ---\n")
        print("Output written to ssh_output.txt")
    except Exception as e:
        print(f"SSH Exception: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        run_ssh_command("103.175.219.57", "root", "M4ruw4h3@", sys.argv[1])
