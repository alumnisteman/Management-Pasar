import paramiko

host = '103.175.219.57'
user = 'root'
password = 'M4ruw4h3@'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(host, username=user, password=password)
    print("Connected.")

    checks = {
        "Temp files in /tmp": "find /tmp -type f -size +1M 2>/dev/null | head -20",
        "Large log files (>50MB)": "find /var/log -type f -size +50M -exec ls -lh {} \\; 2>/dev/null",
        "Docker build cache": "docker system df",
        "Disk usage /": "df -h /",
        "Orphaned volumes": "docker volume ls -f dangling=true",
        "Old log files": "find /var/log -name '*.gz' -o -name '*.1' -o -name '*.old' 2>/dev/null | head -20",
    }

    for title, cmd in checks.items():
        print(f"\n{'='*50}")
        print(f"  {title}")
        print('='*50)
        stdin, stdout, stderr = client.exec_command(cmd)
        out = stdout.read().decode().strip()
        err = stderr.read().decode().strip()
        print(out if out else "(empty)")
        if err:
            print(f"[stderr]: {err}")

except Exception as e:
    print(f"Error: {e}")
finally:
    client.close()
