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
    if err: print("ERR:", err)

# Check all users in the users table
run("""docker exec svms-mysql-1 mysql -uroot -proot svms -e "SELECT id, name, email, LEFT(password,30) as pwd_hash, created_at, updated_at FROM users ORDER BY created_at;" """)

# Also check if there's an admin user specifically
run("""docker exec svms-mysql-1 mysql -uroot -proot svms -e "SELECT name, email, created_at, updated_at FROM users WHERE email LIKE '%admin%' OR name LIKE '%admin%' OR name LIKE '%Admin%';" """)

ssh.close()
