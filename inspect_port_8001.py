import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

def run_cmd(cmd):
    print(f"\n=== Running: {cmd} ===")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out:
        print("STDOUT:")
        print(out[:2000])
    if err:
        print("STDERR:")
        print(err[:1000])
    return out

print("Before killing host process...")
run_cmd("curl -sI http://localhost:8001")
run_cmd("curl -s http://localhost:8001 | grep -i -E 'NewsHybrid|SVMS' | head -n 10")

print("\nKilling Next.js host processes running on port 8001...")
run_cmd("pkill -f 'next dev -p 8001' || true")
run_cmd("pkill -f 'next-server' || true")
run_cmd("pkill -f 'next' || true")

print("\nAfter killing, checking what is listening on port 8001...")
run_cmd("ss -tlnp | grep 8001 || echo 'Nothing listening on host port 8001 directly'")

print("\nCurling http://localhost:8001 now...")
run_cmd("curl -sI http://localhost:8001")
run_cmd("curl -s http://localhost:8001 | grep -i -E 'NewsHybrid|SVMS' | head -n 10")

ssh.close()
