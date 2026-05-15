import paramiko

def force_scout_import():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        # Run import and capture output to file
        cmd = "docker exec svms-app-1 php artisan scout:import 'App\\Models\\Trader' > /tmp/scout_trader.log 2>&1"
        client.exec_command(cmd)
        cmd2 = "docker exec svms-app-1 php artisan scout:import 'App\\Models\\Slot' > /tmp/scout_slot.log 2>&1"
        client.exec_command(cmd2)
        print("Import commands sent. Logs at /tmp/scout_*.log")
        
        # Read logs after a few seconds
        import time
        time.sleep(5)
        stdin, stdout, stderr = client.exec_command("cat /tmp/scout_trader.log")
        print("Trader Log:", stdout.read().decode())
        stdin, stdout, stderr = client.exec_command("cat /tmp/scout_slot.log")
        print("Slot Log:", stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    force_scout_import()
