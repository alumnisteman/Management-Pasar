import paramiko
import sys

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

def run(cmd, label=None):
    if label:
        print(f'\n=== {label} ===')
    print(f'>> {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out.strip(): print(out)
    if err.strip(): print('ERR:', err)
    return out

# Step 1: Fix platform_check.php permanently (set to PHP 8.2)
run(
    "sed -i 's/PHP_VERSION_ID >= 80400/PHP_VERSION_ID >= 80200/' /var/www/svms/backend/vendor/composer/platform_check.php",
    "Fix platform_check.php (8.4 -> 8.2)"
)
run("head -10 /var/www/svms/backend/vendor/composer/platform_check.php", "Verify fix")

# Step 2: Clear all caches
run('cd /var/www/svms/backend && php artisan cache:clear 2>&1', "cache:clear")
run('cd /var/www/svms/backend && php artisan view:clear 2>&1', "view:clear")
run('cd /var/www/svms/backend && php artisan route:clear 2>&1', "route:clear")

# Step 3: Check views directory now exists
run('ls -la /var/www/svms/backend/storage/framework/views/', "Views dir check")

# Step 4: Check what the actual payment error is - test the endpoint
run(
    "curl -s -X POST http://localhost/api/tenant/pay-bill -H 'Content-Type: application/json' -d '{\"bill_id\":1,\"trader_id\":1}' 2>&1 | head -50",
    "Test pay-bill endpoint (localhost)"
)

# Step 5: Check nginx/apache config to find which port
run('cat /etc/nginx/sites-enabled/* 2>/dev/null | grep -E "listen|root|server_name" | head -30', "Nginx config")
run('ss -tlnp | grep -E "80|8001|443"', "Listening ports")

# Step 6: Check if the app is served via PHP-FPM or artisan serve
run('ps aux | grep -E "php|nginx|apache" | grep -v grep | head -20', "Running processes")

ssh.close()
print('\n=== DONE ===')
