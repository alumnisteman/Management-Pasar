import paramiko

def debug_pricelog():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        # Using double quotes for PHP and escaping properly for shell
        tinker_cmd = "echo App\\Models\\PriceLog::create(['commodity_name' => 'Test', 'price' => 1000, 'recorded_at' => '2026-05-07', 'slot_id' => null]);"
        full_cmd = f'docker exec svms-app-1 php artisan tinker --execute="{tinker_cmd}"'
        
        stdin, stdout, stderr = client.exec_command(full_cmd)
        print("OUT:", stdout.read().decode())
        print("ERR:", stderr.read().decode())
    finally:
        client.close()

if __name__ == "__main__":
    debug_pricelog()
