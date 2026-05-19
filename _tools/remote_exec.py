import sys
import paramiko

def main():
    if len(sys.argv) < 2:
        print("Usage: python remote_exec.py \"<command>\"")
        sys.exit(1)
        
    command = sys.argv[1]
    host = "103.175.219.57"
    user = "root"
    password = "M4ruw4h3@"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        print(f"Connecting to {host}...")
        client.connect(host, username=user, password=password)
        
        print(f"Executing remote command: {command}")
        stdin, stdout, stderr = client.exec_command(command)
        
        # Read output in real-time
        for line in stdout:
            try:
                print(line, end="")
            except UnicodeEncodeError:
                try:
                    print(line.encode(sys.stdout.encoding, errors='replace').decode(sys.stdout.encoding), end="")
                except Exception:
                    pass
            
        err = stderr.read().decode('utf-8')
        if err:
            print("\nError Output:")
            print(err)
            
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    main()
