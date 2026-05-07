import os
import datetime
import subprocess

# Configuration
DB_HOST = "127.0.0.1"
DB_USER = "svms_user"
DB_PASS = "svms_pass"
DB_NAME = "svms_db"
BACKUP_DIR = "/var/www/svms/backups"

def run_backup():
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"svms_backup_{timestamp}.sql"
    filepath = os.path.join(BACKUP_DIR, filename)
    
    print(f"Starting backup for {DB_NAME}...")
    
    # mysqldump command
    cmd = f"mysqldump -h {DB_HOST} -u {DB_USER} -p{DB_PASS} {DB_NAME} > {filepath}"
    
    try:
        subprocess.check_call(cmd, shell=True)
        # Compress
        subprocess.check_call(f"gzip {filepath}", shell=True)
        print(f"Backup successful: {filepath}.gz")
        
        # Cleanup: Keep only last 7 days of backups
        cleanup_old_backups()
        
    except Exception as e:
        print(f"Backup failed: {str(e)}")

def cleanup_old_backups():
    print("Cleaning up old backups...")
    now = datetime.datetime.now()
    for f in os.listdir(BACKUP_DIR):
        f_path = os.path.join(BACKUP_DIR, f)
        if os.stat(f_path).st_mtime < (now - datetime.timedelta(days=7)).timestamp():
            os.remove(f_path)
            print(f"Deleted old backup: {f}")

if __name__ == "__main__":
    run_backup()
