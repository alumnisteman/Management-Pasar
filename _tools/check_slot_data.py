import paramiko

def check_slot_data():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        
        commands = [
            ("Null IDs", "App\\Models\\Slot::whereNull('id')->count()"),
            ("Empty IDs", "App\\Models\\Slot::where('id', '')->count()"),
            ("Null Status", "App\\Models\\Slot::whereNull('status')->count()"),
            ("Duplicate Codes Count", "App\\Models\\Slot::select('code')->groupBy('code')->havingRaw('count(*) > 1')->get()->count()"),
            ("Total Slots", "App\\Models\\Slot::count()")
        ]
        
        for label, php_cmd in commands:
            full_cmd = f'docker exec svms-app-1 php artisan tinker --execute="echo {php_cmd};"'
            stdin, stdout, stderr = client.exec_command(full_cmd)
            print(f"{label}: {stdout.read().decode().strip()}")
            
    finally:
        client.close()

if __name__ == "__main__":
    check_slot_data()
