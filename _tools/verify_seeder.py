import paramiko

def run_seeder():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        print("Running seeder...")
        stdin, stdout, stderr = client.exec_command('docker exec svms-app-1 php artisan db:seed --class=DummyDataSeeder')
        
        output = stdout.read().decode('utf-8', 'ignore')
        error = stderr.read().decode('utf-8', 'ignore')
        
        print("Seeder executed. Checking counts...")
        
        # Verify counts
        stdin, stdout, stderr = client.exec_command('docker exec svms-app-1 php artisan tinker --execute="echo \'Traders: \' . App\\Models\\Trader::count() . \' | Slots: \' . App\\Models\\Slot::count() . \' | PriceLogs: \' . App\\Models\\PriceLog::count();"')
        res = stdout.read().decode('utf-8', 'ignore')
        print("Verification Result:", res)
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    run_seeder()
