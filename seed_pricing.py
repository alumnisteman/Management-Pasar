import paramiko

def seed_pricing():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        # Seed pricing settings
        code = """
        App\Models\Setting::updateOrCreate(['key' => 'price_daily_standard'], ['value' => '15000', 'group' => 'pricing']);
        App\Models\Setting::updateOrCreate(['key' => 'price_daily_premium'], ['value' => '25000', 'group' => 'pricing']);
        App\Models\Setting::updateOrCreate(['key' => 'price_monthly_standard'], ['value' => '400000', 'group' => 'pricing']);
        App\Models\Setting::updateOrCreate(['key' => 'price_monthly_premium'], ['value' => '750000', 'group' => 'pricing']);
        """
        cmd = f"docker exec svms-app-1 php artisan tinker --execute=\"{code}\""
        client.exec_command(cmd)
        print("Pricing settings seeded.")
    finally:
        client.close()

if __name__ == "__main__":
    seed_pricing()
