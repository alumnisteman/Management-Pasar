import os
import subprocess
import sys

# Configuration
DB_HOST = "127.0.0.1"
DB_USER = "svms_user"
DB_PASS = "svms_pass"
DB_NAME = "svms_db"
BACKUP_DIR = "/var/www/svms/backups"

def run_restore(filename):
    filepath = os.path.join(BACKUP_DIR, filename)
    
    if not os.path.exists(filepath):
        print(f"Error: File {filename} not found in {BACKUP_DIR}")
        return

    print(f"Starting restore of {DB_NAME} from {filename}...")
    
    # Handle gzipped files
    target_sql = filepath
    if filepath.endswith(".gz"):
        print("Decompressing backup...")
        subprocess.check_call(f"gunzip -k {filepath}", shell=True)
        target_sql = filepath[:-3]

    # mysql restore command
    cmd = f"mysql -h {DB_HOST} -u {DB_USER} -p{DB_PASS} {DB_NAME} < {target_sql}"
    
    try:
        subprocess.check_call(cmd, shell=True)
        print(f"Restore successful!")
        
        # Cleanup decompressed file if we created it
        if filepath.endswith(".gz"):
            os.remove(target_sql)
            
    except Exception as e:
        print(f"Restore failed: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python restore_db.py <backup_filename>")
        sys.exit(1)
    
    run_restore(sys.argv[1])
