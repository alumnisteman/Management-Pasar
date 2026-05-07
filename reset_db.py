import paramiko

def reset_and_seed():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        
        # Clear tables in correct order
        tables = ['permits', 'payments', 'audit_logs', 'price_logs', 'slots', 'traders', 'wallets', 'wallet_transactions']
        for table in tables:
            print(f"Clearing {table}...")
            client.exec_command(f"docker exec svms-app-1 php artisan tinker --execute=\"DB::table('{table}')->delete();\"")
            
        print("Uploading updated seeder...")
        # I'll just use my deploy_seeder.py logic but I need to make sure it's the updated one
        # Actually I already updated DummyDataSeeder.php locally.
        
    finally:
        client.close()

if __name__ == "__main__":
    reset_and_seed()
