import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def run_build(host, user, password, cwd, command, outfile='build_server.log'):
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(host, username=user, password=password, timeout=120)
        
        full_cmd = f"cd {cwd} && {command} 2>&1"
        stdin, stdout, stderr = client.exec_command(full_cmd, timeout=300)
        
        output = stdout.read().decode('utf-8', errors='replace')
        
        with open(outfile, 'w', encoding='utf-8') as f:
            f.write(output)

        lines = output.split('\n')
        total = len(lines)
        print(f"Total lines: {total}")
        print("=== FIRST 50 LINES ===")
        print('\n'.join(lines[:50]))
        print(f"\n=== LAST 60 LINES ===")
        print('\n'.join(lines[max(0,total-60):]))
        
        exit_status = stdout.channel.recv_exit_status()
        print(f"\n=== EXIT CODE: {exit_status} ===")
        
        client.close()
    except Exception as e:
        print(f"SSH Error: {e}")

run_build('103.175.219.57', 'root', 'M4ruw4h3@', '/var/www/svms/apps/web', 'npm run build')
