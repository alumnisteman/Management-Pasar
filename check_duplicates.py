import paramiko

def check_duplicates():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        # Check for duplicate codes
        tinker_cmd = "echo App\\Models\\Slot::select('code', DB::raw('count(*) as count'))->groupBy('code')->having('count', '>', 1)->get();"
        full_cmd = f'docker exec svms-app-1 php artisan tinker --execute="{tinker_cmd}"'
        stdin, stdout, stderr = client.exec_command(full_cmd)
        out = stdout.read().decode().strip()
        print("Duplicate Codes:", out[:1000])
        
        # Check specific codes mentioned by user
        codes = ['K-004', 'B-021', 'K-010', 'K-025', 'K-008', 'K-011', 'K-013', 'K-007', 'B-006', 'K-017']
        for code in codes:
            tinker_cmd = f"echo App\\Models\\Slot::where('code', '{code}')->get();"
            full_cmd = f'docker exec svms-app-1 php artisan tinker --execute="{tinker_cmd}"'
            stdin, stdout, stderr = client.exec_command(full_cmd)
            print(f"Data for {code}:", stdout.read().decode().strip())
    finally:
        client.close()

if __name__ == "__main__":
    check_duplicates()
