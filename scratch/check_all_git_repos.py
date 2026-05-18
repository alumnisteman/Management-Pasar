import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def check_all_repos():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    find_cmd = "find /var/www -name '.git' -type d"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        
        print("Finding all Git repositories on the server under /var/www...")
        stdin, stdout, stderr = client.exec_command(find_cmd)
        git_dirs = stdout.read().decode('utf-8', errors='ignore').splitlines()
        
        for git_dir in git_dirs:
            repo_path = git_dir.replace('/.git', '')
            print(f"\n========================================\nChecking Repository: {repo_path}")
            
            cmd = f"cd {repo_path} && git remote -v && git fetch --all && git status && git log -n 5 --oneline && echo '--- Remote comparison ---' && git log HEAD..origin/master --oneline"
            stdin, stdout, stderr = client.exec_command(cmd)
            
            out = stdout.read().decode('utf-8', errors='ignore')
            err = stderr.read().decode('utf-8', errors='ignore')
            if out:
                print("STDOUT:")
                print(out)
            if err:
                print("STDERR:")
                print(err)
            print("="*40 + "\n")
            
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_all_repos()
