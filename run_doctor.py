import paramiko

def run_doctor():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        stdin, stdout, stderr = client.exec_command('docker exec svms-app-1 php artisan system:doctor --fix')
        out = stdout.read().decode('utf-8', errors='replace')
        with open('doctor_output.txt', 'w', encoding='utf-8') as f:
            f.write(out)
        print("Doctor output saved to doctor_output.txt")
    finally:
        client.close()

if __name__ == "__main__":
    run_doctor()
