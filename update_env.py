import paramiko

def update_env():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        
        # Read .env
        stdin, stdout, stderr = client.exec_command('docker exec svms-app-1 cat .env')
        env_content = stdout.read().decode()
        
        # Replace values
        new_content = env_content.replace('SESSION_DRIVER=file', 'SESSION_DRIVER=redis')
        new_content = new_content.replace('CACHE_STORE=database', 'CACHE_STORE=redis')
        new_content = new_content.replace('REDIS_CLIENT=phpredis', 'REDIS_CLIENT=predis')
        new_content = new_content.replace('REDIS_HOST=127.0.0.1', 'REDIS_HOST=redis')
        
        # Add Scout settings
        if 'SCOUT_DRIVER' not in new_content:
            new_content += "\nSCOUT_DRIVER=meilisearch\nMEILISEARCH_HOST=http://steman_meilisearch:7700\nMEILISEARCH_KEY=stemanMasterKey123\n"
        
        # Write back
        sftp = client.open_sftp()
        with sftp.file('/tmp/.env_new', 'w') as f:
            f.write(new_content)
        
        client.exec_command('docker cp /tmp/.env_new svms-app-1:/var/www/.env')
        print("ENV updated for Redis and Predis.")
        
    finally:
        client.close()

if __name__ == "__main__":
    update_env()
