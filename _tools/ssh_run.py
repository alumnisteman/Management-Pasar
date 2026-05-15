import paramiko
import sys
import os

def run_ssh_command(host, user, password, command):
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(host, username=user, password=password, timeout=10)
        
        stdin, stdout, stderr = client.exec_command(command)
        
        out = stdout.read().decode('utf-8')
        err = stderr.read().decode('utf-8')
        exit_status = stdout.channel.recv_exit_status()
        
        print("--- STDOUT ---")
        print(out)
        print("--- STDERR ---")
        print(err)
        print(f"--- EXIT CODE: {exit_status} ---")
        
        client.close()
    except Exception as e:
        print(f"SSH Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python ssh_run.py <host> <user> <password> <command>")
        sys.exit(1)
        
    host = sys.argv[1]
    user = sys.argv[2]
    password = sys.argv[3]
    command = " ".join(sys.argv[4:])
    
    run_ssh_command(host, user, password, command)
