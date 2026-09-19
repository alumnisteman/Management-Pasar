import paramiko

def force_env_scout():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        
        # Read .env
        stdin, stdout, stderr = client.exec_command('docker exec svms-app-1 cat .env')
        env_content = stdout.read().decode()
        
        # Remove any existing scout/meili lines to start fresh
        lines = env_content.splitlines()
        new_lines = [l for l in lines if not any(k in l for k in ['SCOUT_DRIVER', 'MEILISEARCH_HOST', 'MEILISEARCH_KEY'])]
        
        # Add fresh settings
        new_lines.append("SCOUT_DRIVER=meilisearch")
        new_lines.append("MEILISEARCH_HOST=http://steman_meilisearch:7700")
        new_lines.append("MEILISEARCH_KEY=stemanMasterKey123")
        
        new_content = "\n".join(new_lines) + "\n"
        
        # Write back
        sftp = client.open_sftp()
        with sftp.file('/tmp/.env_scout', 'w') as f:
            f.write(new_content)
        
        client.exec_command('docker cp /tmp/.env_scout svms-app-1:/var/www/.env')
        print("ENV updated with Scout and Meilisearch Key.")
        
    finally:
        client.close()

if __name__ == "__main__":
    force_env_scout()
