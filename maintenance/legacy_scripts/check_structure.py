import paramiko

def check_structure():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        # Check users columns
        cmd1 = "docker exec svms-app-1 php artisan tinker --execute=\"print_r(Schema::getColumnListing('users'));\""
        stdin, stdout, stderr = client.exec_command(cmd1)
        print("Users Columns:", stdout.read().decode())
        
        # Check settings
        cmd2 = "docker exec svms-app-1 php artisan tinker --execute=\"print_r(App\Models\Setting::all()->toArray());\""
        stdin, stdout, stderr = client.exec_command(cmd2)
        print("Settings Data:", stdout.read().decode())
    finally:
        client.close()

if __name__ == "__main__":
    check_structure()
