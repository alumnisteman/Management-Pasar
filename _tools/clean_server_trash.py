import paramiko

host = '103.175.219.57'
user = 'root'
password = 'M4ruw4h3@'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(host, username=user, password=password)
    print("Connected to server.")

    tasks = [
        ("1. Remove temp files in /tmp", "rm -f /tmp/smart_market_hero_*.png /tmp/apps.zip"),
        ("2. Remove orphaned Docker volumes", "docker volume prune -f"),
        ("3. Remove Docker build cache (22.9GB!)", "docker builder prune -f"),
        ("4. Disk usage AFTER cleanup", "df -h /"),
        ("5. Docker system check after", "docker system df"),
    ]

    for title, cmd in tasks:
        print(f"\n{'='*50}")
        print(f"  {title}")
        print(f"  CMD: {cmd}")
        print('='*50)
        stdin, stdout, stderr = client.exec_command(cmd, timeout=120)
        out = stdout.read().decode().strip()
        err = stderr.read().decode().strip()
        print(out if out else "(done)")
        if err:
            print(f"[stderr]: {err}")

    print("\n\n✅ Server cleanup complete!")

except Exception as e:
    print(f"Error: {e}")
finally:
    client.close()
