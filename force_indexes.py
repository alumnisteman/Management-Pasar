import paramiko

def force_indexes():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect('103.175.219.57', username='root', password='M4ruw4h3@')
        
        sql_commands = [
            "CREATE INDEX slots_code_index ON slots(code);",
            "CREATE INDEX slots_status_index ON slots(status);",
            "CREATE INDEX slots_category_index ON slots(category);",
            "CREATE INDEX traders_nik_index ON traders(nik);",
            "CREATE INDEX traders_status_index ON traders(status);",
            "CREATE INDEX permits_status_index ON permits(status);",
            "CREATE INDEX permits_issued_at_index ON permits(issued_at);",
            "CREATE INDEX permits_expires_at_index ON permits(expires_at);",
            "CREATE INDEX payments_status_index ON payments(status);",
            "CREATE INDEX payments_created_at_index ON payments(created_at);",
            "CREATE INDEX audit_logs_module_index ON audit_logs(module);",
            "CREATE INDEX audit_logs_action_index ON audit_logs(action);",
            "CREATE INDEX audit_logs_created_at_index ON audit_logs(created_at);"
        ]
        
        for sql in sql_commands:
            print(f"Running: {sql}")
            cmd = f'docker exec svms-mysql-1 mysql -u root -proot svms -e "{sql}"'
            stdin, stdout, stderr = client.exec_command(cmd)
            print(stdout.read().decode())
            print(stderr.read().decode())
            
    finally:
        client.close()

if __name__ == "__main__":
    force_indexes()
