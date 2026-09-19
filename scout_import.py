import paramiko

def scout_import():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        models = ["App\\Models\\Trader", "App\\Models\\Slot"]
        for model in models:
            print(f"Importing {model}...")
            cmd = f'docker exec svms-app-1 php artisan scout:import "{model}"'
            stdin, stdout, stderr = client.exec_command(cmd)
            print(stdout.read().decode())
            print(stderr.read().decode())
    finally:
        client.close()

if __name__ == "__main__":
    scout_import()
