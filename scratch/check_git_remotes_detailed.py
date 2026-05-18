import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def check_detailed_git():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    repos = [
        "/var/www/html",
        "/var/www/steman-alumni",
        "/var/www/svms/backend"
    ]
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        for repo_path in repos:
            print(f"\n==================================================")
            print(f"REPOSITORI: {repo_path}")
            print(f"==================================================")
            
            # Fetch remote changes
            print("[Fetching from origin...]")
            stdin, stdout, stderr = client.exec_command(f"cd {repo_path} && git fetch origin")
            stderr.read() # Wait for fetch
            
            # Check git status, current branch, local vs remote differences
            cmd = (
                f"cd {repo_path} && "
                f"echo '=== Remote URL ===' && git remote -v && "
                f"echo '=== Current Status ===' && git status -sb && "
                f"echo '=== Last 3 Commits ===' && git log -n 3 --oneline && "
                f"echo '=== Differences from Origin (HEAD..origin/master) ===' && "
                f"git log HEAD..origin/master --oneline || git log HEAD..origin/main --oneline"
            )
            stdin, stdout, stderr = client.exec_command(cmd)
            out = stdout.read().decode('utf-8', errors='replace')
            print(out)
            
            err = stderr.read().decode('utf-8', errors='replace')
            if err:
                print("STDERR:")
                print(err)
            
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_detailed_git()
