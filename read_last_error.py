import paramiko

def read_log():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
    stdin, stdout, stderr = client.exec_command('docker exec svms-app-1 tail -n 500 storage/logs/laravel.log')
    log = stdout.read().decode('utf-8', errors='replace')
    
    # Find the last "production.ERROR"
    errors = log.split('production.ERROR:')
    if len(errors) > 1:
        last_error = errors[-1].split('\n')[0]
        print(f"LAST ERROR: {last_error}")
    else:
        print("No production.ERROR found in last 500 lines.")
    client.close()

if __name__ == "__main__":
    read_log()
