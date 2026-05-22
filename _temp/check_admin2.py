import paramiko
import sys
sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

def run(cmd):
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out: print(out)
    # ignore mysql password warning
    if err and 'Warning' not in err: print("ERR:", err)

print("=== All users in DB ===")
run("""docker exec svms-mysql-1 mysql -uroot -proot svms -e "SELECT id, name, email, LEFT(password,25) as pwd_hash, created_at, updated_at FROM users ORDER BY created_at;" 2>/dev/null""")

print("\n=== Looking for any password='123' or hashes of '123' ===")
# bcrypt hash of '123' could be many things, so let's just count users
run("""docker exec svms-mysql-1 mysql -uroot -proot svms -e "SELECT COUNT(*) as total_users FROM users;" 2>/dev/null""")

print("\n=== Check if there's admin-related routes that do auto-login ===")
run("grep -rn 'password.*123\\|123.*password\\|admin.*123\\|123.*admin' /var/www/svms/backend/routes/ 2>/dev/null | head -20")
run("grep -rn 'updateOrCreate.*password\\|firstOrCreate.*password' /var/www/svms/backend/app/ 2>/dev/null | head -20")

print("\n=== Check Dockerfile.prod for any seed command ===")
run("cat /var/www/svms/backend/Dockerfile.prod")

ssh.close()
