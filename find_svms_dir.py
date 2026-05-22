import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

def run_cmd(cmd):
    print(f"\n=== Running: {cmd} ===")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out:
        print("STDOUT:")
        print(out[:5000])
    if err:
        print("STDERR:")
        print(err[:2000])

# Find SVMS project directory
print("Finding svms docker-compose file:")
run_cmd("find / -name 'docker-compose.yml' -not -path '*/proc/*' 2>/dev/null | xargs grep -l 'svms-frontend' 2>/dev/null")

# Check if svms project is in /root
run_cmd("ls /root/")
run_cmd("ls /var/www/ 2>/dev/null")
run_cmd("find /root -name 'docker-compose.yml' 2>/dev/null")

ssh.close()
