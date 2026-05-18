import paramiko

host = "103.175.219.57"
user = "root"
password = "M4ruw4h3@"

commands = """
cat /var/www/steman-alumni/app/Services/SystemGuard/HealthChecker.php
"""

















ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    print(f"Connecting to {host}...")
    ssh.connect(host, username=user, password=password)
    print("Connected! Executing commands...")
    stdin, stdout, stderr = ssh.exec_command(commands)
    
    # Wait for the command to finish and print output
    exit_status = stdout.channel.recv_exit_status()
    out_text = stdout.read().decode('utf-8', errors='replace')
    err_text = stderr.read().decode('utf-8', errors='replace')
    with open("ssh_output.txt", "w", encoding="utf-8") as f:
        f.write("Output:\n" + out_text + "\nError:\n" + err_text + "\nExit: " + str(exit_status))
    print("Deployment finished, output written to ssh_output.txt")
except Exception as e:
    print(f"Failed to connect or execute: {e}")
finally:
    ssh.close()
