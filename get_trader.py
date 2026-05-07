import paramiko

def get_valid_trader():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        stdin, stdout, stderr = client.exec_command('docker exec svms-app-1 php artisan tinker --execute="echo App\\Models\\Trader::first()->id;"')
        print(f"Trader ID: {stdout.read().decode().strip()}")
    finally:
        client.close()

if __name__ == "__main__":
    get_valid_trader()
