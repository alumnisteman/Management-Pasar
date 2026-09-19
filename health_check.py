import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('103.175.219.57', username='root', password='M4ruw4h3@')

endpoints = [
    ('vendors API (Database Pedagang)', 'curl -s http://localhost:8000/api/vendors | python3 -c "import sys,json; d=json.load(sys.stdin); print(f\'OK - {len(d)} traders found\')" 2>/dev/null || curl -s http://localhost:8000/api/vendors | head -c 100'),
    ('grid-slots API (Zonasi)', 'curl -s http://localhost:8000/api/grid-slots | python3 -c "import sys,json; d=json.load(sys.stdin); print(f\'OK - {len(d)} slots found\')" 2>/dev/null || curl -s http://localhost:8000/api/grid-slots | head -c 100'),
    ('permits API (Daftar Izin)', 'curl -s http://localhost:8000/api/permits | python3 -c "import sys,json; d=json.load(sys.stdin); print(f\'OK - {len(d)} permits found\')" 2>/dev/null || curl -s http://localhost:8000/api/permits | head -c 100'),
    ('command-center stats', 'curl -s http://localhost:8000/api/command-center/stats | head -c 150'),
    ('AI Intelligence Brief', 'curl -s http://localhost:8000/api/ai/brief | head -c 200'),
    ('verify SIPTU PMT-VSTSCDVI', 'curl -s http://localhost:8000/api/verify-smos/PMT-VSTSCDVI | head -c 150'),
    ('admin page HTTP status', 'curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/admin'),
    ('landing page HTTP status', 'curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/'),
]

print('=' * 60)
print('SVMS v6.0 - SYSTEM HEALTH CHECK')
print('=' * 60)

all_ok = True
for name, cmd in endpoints:
    _, stdout, stderr = client.exec_command(f'docker exec svms-app-1 {cmd}')
    result = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    
    # Determine status
    if result.startswith('OK') or result in ['200', '301', '302']:
        status = '[OK]'
    elif 'error' in result.lower() or result.startswith('5') or not result:
        status = '[FAIL]'
        all_ok = False
    else:
        status = '[WARN]'
    
    print(f'{status} [{name}]')
    print(f'   {result[:120]}')
    print()

print('=' * 60)
print('Overall Status:', 'ALL SYSTEMS GO' if all_ok else 'Some issues detected')
print('=' * 60)

client.close()
