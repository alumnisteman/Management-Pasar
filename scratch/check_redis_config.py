import paramiko

def main():
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=user, password=password)
        print("Connected to server.")
        
        # Run tinker command
        command = "docker exec -i svms-worker-1 php artisan tinker"
        stdin, stdout, stderr = client.exec_command(command)
        
        # Send config command to tinker
        stdin.write("config('database.redis')\n")
        stdin.flush()
        stdin.channel.shutdown_write() # Signal EOF so tinker completes
        
        print("--- TINKER OUTPUT ---")
        print(stdout.read().decode('utf-8'))
        print("--- ERRORS ---")
        print(stderr.read().decode('utf-8'))
        
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
